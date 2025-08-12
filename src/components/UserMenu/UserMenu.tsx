import React, { useState } from 'react';
import { 
  Menu, 
  Button, 
  Avatar, 
  Text, 
  Divider,
  Modal,
  TextInput,
  Group
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { 
  IconLogout, 
  IconKey, 
  IconChevronDown,
  IconCheck
} from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
import type { ChangePasswordRequest } from '../../types/auth';
import styles from './UserMenu.module.css';

// Form interface includes confirmPassword for client-side validation
interface PasswordChangeForm extends ChangePasswordRequest {
  confirmPassword: string;
}

export const UserMenu: React.FC = () => {
  const { user, logout, changePassword, authEnabled } = useAuth();
  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const passwordForm = useForm<PasswordChangeForm>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value) => (!value ? 'Current password is required' : null),
      newPassword: (value) => {
        if (!value) return 'New password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Please confirm your password';
        if (value !== values.newPassword) return 'Passwords do not match';
        return null;
      },
    },
  });

  const handleLogout = () => {
    logout();
  };

  const handleChangePassword = async (values: PasswordChangeForm) => {
    try {
      setIsChangingPassword(true);
      // Extract only the fields needed for the API
      const { currentPassword, newPassword } = values;
      await changePassword({ currentPassword, newPassword });
      passwordForm.reset();
      closePasswordModal();
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Don't show user menu if auth is disabled
  if (!authEnabled || !user) {
    return null;
  }

  const userInitials = user.username ? user.username.substring(0, 2).toUpperCase() : 'U';

  return (
    <>
      <Menu shadow="md" width={220} position="bottom-end">
        <Menu.Target>
          <Button 
            variant="subtle" 
            className={styles.userButton}
            rightSection={<IconChevronDown size={16} />}
          >
            <Avatar size="sm" color="blue" className={styles.avatar}>
              {userInitials}
            </Avatar>
            <div className={styles.userInfo}>
              <Text size="sm" fw={500} className={styles.username}>
                {user.username}
              </Text>
            </div>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item disabled className={styles.userEmail}>
            <div>
              <Text size="sm" fw={500}>{user.username}</Text>
              <Text size="xs" c="dimmed">{user.email}</Text>
            </div>
          </Menu.Item>
          
          <Divider />
          
          <Menu.Item 
            leftSection={<IconKey size={16} />}
            onClick={openPasswordModal}
          >
            Change Password
          </Menu.Item>
          
          <Divider />
          
          <Menu.Item 
            color="red" 
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* Change Password Modal */}
      <Modal
        opened={passwordModalOpened}
        onClose={closePasswordModal}
        title="Change Password"
        centered
        className={styles.passwordModal}
      >
        <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
          <TextInput
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            {...passwordForm.getInputProps('currentPassword')}
            mb="md"
            required
          />

          <TextInput
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            {...passwordForm.getInputProps('newPassword')}
            mb="md"
            required
          />

          <TextInput
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your new password"
            {...passwordForm.getInputProps('confirmPassword')}
            mb="lg"
            required
          />

          <Group justify="flex-end">
            <Button 
              variant="subtle" 
              onClick={() => {
                passwordForm.reset();
                closePasswordModal();
              }}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={isChangingPassword}
              leftSection={<IconCheck size={16} />}
            >
              Change Password
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};
