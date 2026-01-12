# ACCEPTANCE_enable_behance_ui

## 1. Requirement Checklist
- [x] Enable Behance option in UI platform selector.

## 2. Changes
- Modified `kb-web/src/components/online-cases/add-case-dialog.tsx`: Set `enabled: true` for `BEHANCE`.

## 3. Verification
- Confirmed code change sets the flag to true.
- User should now see the button as clickable (not disabled).
