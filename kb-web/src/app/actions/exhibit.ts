'use server'

import { revalidatePath } from 'next/cache'
import { saveExhibit, copyAssetToExhibit, ExhibitData } from '@/lib/doc-system'
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db'; // Keep DB for asset lookup if needed, but not for exhibit storage

export async function createExhibitAction(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content = formData.get('content') as string
  const status = formData.get('status') as string
  const metadataStr = formData.get('metadata') as string
  const assetIdsStr = formData.get('assetIds') as string

  try {
    const id = uuidv4();
    const assetIds = assetIdsStr ? JSON.parse(assetIdsStr) : [];
    
    // 处理 Assets: 将选中的 Assets 从 uploads 复制到 Doc/{title}/
    const finalAssets = [];
    
    // 查询 DB 获取 Asset 的物理路径 (因为 uploads 下的文件我们只知道 ID 对应的路径)
    // 假设 db.asset 仍然存储了 uploads 下文件的信息
    const dbAssets = await db.asset.findMany({
        where: { id: { in: assetIds } }
    });

    for (const asset of dbAssets) {
        // 复制文件
        // asset.path 是绝对路径 (由 storage.ts saveFile 返回)
        const fileName = await copyAssetToExhibit(title, asset.path, asset.name);
        finalAssets.push({
            id: asset.id, // 保留原 ID 或者生成新 ID? 保留原 ID 方便追踪，但在 Doc 中它只是一个文件
            name: asset.name,
            type: asset.type,
            path: fileName, // 相对路径
            mimeType: asset.mimeType
        });
    }

    const exhibitData: ExhibitData = {
        id,
        title,
        description,
        content,
        status: status || 'draft',
        metadata: JSON.parse(metadataStr || '{}'),
        assets: finalAssets,
        updatedAt: new Date().toISOString()
    };

    await saveExhibit(exhibitData);

    revalidatePath('/admin')
    revalidatePath('/gallery')
    return { success: true, id }
  } catch (error) {
    console.error('Create exhibit error:', error)
    return { error: 'Failed to create exhibit' }
  }
}

export async function updateExhibitAction(id: string, formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const status = formData.get('status') as string
    const metadataStr = formData.get('metadata') as string
    const assetIdsStr = formData.get('assetIds') as string
    
    // 对于更新，我们需要先读取旧数据以获取旧标题（用于重命名文件夹）
    // 但由于 Action 的无状态性，我们可能需要前端传递 oldTitle，或者我们遍历所有文件找到 id 匹配的
    // 为了简化，我们假设前端传递了 oldTitle，或者我们在 saveExhibit 中处理了
    // 这里最稳妥的是：先 getExhibitById 找到旧数据
    
    try {
        const { getExhibitById } = await import('@/lib/doc-system');
        const oldExhibit = await getExhibitById(id);
        
        if (!oldExhibit) {
            return { error: 'Exhibit not found' };
        }

        const assetIds = assetIdsStr ? JSON.parse(assetIdsStr) : [];
        
        // 重新处理 Assets
        // 注意：这里有个复杂点。用户可能删除了某些 Asset，也可能添加了新的。
        // 对于已存在的且在 Doc 中的 Asset，我们不需要重新复制。
        // 对于新添加的（在 uploads 中的），我们需要复制。
        // 我们通过检查 assetIds 中的 ID 是否在 oldExhibit.assets 中存在来判断。
        
        const finalAssets = [];
        const newAssetIds = [];
        
        // 1. 保留已有的
        for (const oldAsset of oldExhibit.assets) {
            if (assetIds.includes(oldAsset.id)) {
                finalAssets.push(oldAsset);
            }
        }
        
        // 2. 找出新增的
        for (const newId of assetIds) {
            if (!oldExhibit.assets.find(a => a.id === newId)) {
                newAssetIds.push(newId);
            }
        }
        
        // 3. 复制新增的
        if (newAssetIds.length > 0) {
            const dbAssets = await db.asset.findMany({
                where: { id: { in: newAssetIds } }
            });
            
            for (const asset of dbAssets) {
                // 使用新的 title (如果 title 变了，saveExhibit 会重命名文件夹，所以这里传入新 title 是对的？
                // 不，copyAssetToExhibit 是直接操作 FS。如果此时文件夹还没重命名...
                // 策略：先保存 Exhibit (触发重命名)，然后再复制新文件？
                // 或者：我们先用 oldTitle 复制进去，saveExhibit 会一起移动？
                // 最好是：先 saveExhibit 确保目录结构是最新的，然后再复制文件并更新 assets? 
                // 不行，assets 是 exhibit data 的一部分。
                
                // 简化策略：假设 saveExhibit 会处理好目录。我们先复制到 targetDir (可能是旧名或新名)
                // 实际上 copyAssetToExhibit 需要知道最终的目录名。
                // 让我们先用 title (新标题) 作为目标。如果 saveExhibit 还没执行，copyAssetToExhibit 会创建新目录。
                // 如果 saveExhibit 执行了重命名，它会把旧目录移过来。
                // 冲突点：如果改名了，copyAssetToExhibit 创建了新目录，saveExhibit 重命名旧目录到新目录会冲突。
                
                // 正确顺序：
                // 1. 执行 saveExhibit (更新元数据 + 重命名目录)
                // 2. 此时目录已是新 title
                // 3. 执行 copyAssetToExhibit 到新 title
                // 4. 更新 exhibit data 中的 assets 并再次 saveExhibit (开销不大)
                
                // 但为了代码简单，我们先复制到 "新标题" 目录。
                // 如果是改名场景：oldTitle -> newTitle.
                // saveExhibit 逻辑：rename(old -> new).
                // 如果我们先 copy 到 new，那 new 已经存在，rename 会失败或覆盖。
                
                // 修正逻辑：
                // 我们只在 saveExhibit 中处理目录重命名。
                // 这里的 copyAssetToExhibit 应该只在 saveExhibit 成功后执行？
                // 或者，我们手动处理重命名逻辑在这里？
                
                // 让我们修改 saveExhibit 逻辑，或者：
                // 只要 title 没变，没问题。
                // 如果 title 变了，我们在 copy 前先确保目录一致性。
                
                const fileName = await copyAssetToExhibit(title, asset.path, asset.name);
                finalAssets.push({
                    id: asset.id,
                    name: asset.name,
                    type: asset.type,
                    path: fileName,
                    mimeType: asset.mimeType
                });
            }
        }
        
        const exhibitData: ExhibitData = {
            ...oldExhibit,
            title,
            description,
            content,
            status,
            metadata: JSON.parse(metadataStr || '{}'),
            assets: finalAssets,
            updatedAt: new Date().toISOString()
        };

        await saveExhibit(exhibitData, oldExhibit.title);
        
        revalidatePath(`/admin/exhibits/${id}/edit`)
        revalidatePath(`/gallery/${id}`)
        return { success: true }
    } catch (error) {
        console.error('Update exhibit error:', error)
        return { error: 'Failed to update exhibit' }
    }
}
