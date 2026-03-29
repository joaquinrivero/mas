import sys
sys.path.insert(0, 'adws')
from adw_modules.worktree_ops import create_isolated_environment
from adw_modules.branching import create_branch_name

adw_id = '/Users/rivero/ai/agentic-harness/apps/mas/trees/pw-35226f5c 9100 9200'
branch = create_branch_name(adw_id, 'isolated-workspace')
result = create_isolated_environment(adw_id, branch, skip_deps=False)
if result:
    print(f'Worktree: {result["worktree_path"]}')
    print(f'Studio port: {result["studio_port"]}')
    print(f'WC port: {result["web_components_port"]}')
    print(f'AEM port: {result["aem_libs_port"]}')
else:
    print('Failed to create worktree')