import { Menu } from '@mui/base/Menu'
import { Dropdown } from '@mui/base/Dropdown'
import { MenuButton } from '@mui/base/MenuButton'
import { MenuItem } from '@mui/base/MenuItem'
import Logout from '@mui/icons-material/Logout'
import Person from '@mui/icons-material/Person'

export type UserMenuProps = {
    username: string
    onLogout: () => unknown
}

export default function UserMenu({ username, onLogout }: UserMenuProps) {
    return (
        <Dropdown>
            <MenuButton className="flex items-center gap-1 font-bold hover:underline">
                <Person sx={{ fontSize: '22px' }} />
                <div className="pb-1">{username}</div>
            </MenuButton>
            <Menu className="border border-neutral-500 bg-neutral-200 p-1 dark:bg-neutral-600">
                <MenuItem
                    className="text-md flex cursor-pointer items-center gap-1 p-1 hover:bg-white dark:hover:bg-neutral-500"
                    onClick={onLogout}
                >
                    <Logout sx={{ fontSize: '20px' }} />
                    <div className="pb-1">Sign out</div>
                </MenuItem>
            </Menu>
        </Dropdown>
    )
}
