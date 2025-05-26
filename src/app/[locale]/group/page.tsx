'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from 'components/forms/text-input';
import TextArea from 'components/forms/text-area';
import { useCreateGroupMutation, useUpdateGroupMutation } from 'hooks/profile';
import { useRouter } from 'next/navigation';
import { useGroupEdit } from 'contexts/GroupEditContext';
import { useEffect, useState } from 'react';
import * as yup from 'yup';

interface GroupFormData {
  GroupName: string;
  CompanyName: string;
  Note?: string;
}

export default function GroupPage() {
  const { onAddGroup, isLoading: isCreating } = useCreateGroupMutation();
  const { onUpdateGroup, isLoading: isUpdating } = useUpdateGroupMutation();
  const router = useRouter();
  const { groupToEdit, clearGroupToEdit } = useGroupEdit();
  const isEditMode = !!groupToEdit;
  const isLoading = isCreating || isUpdating;

  const schema = yup.object().shape({
    GroupName: yup.string().required('Name is required'),
    CompanyName: yup.string().required('Company name is required'),
    Note: yup.string(),
  });

  const { control, handleSubmit, reset } = useForm<GroupFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  // Track if we've initialized the form
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset form when groupToEdit changes
  useEffect(() => {
    if (!isInitialized) {
      if (groupToEdit) {
        reset({
          GroupName: groupToEdit.GroupName,
          CompanyName: groupToEdit.CompanyName,
          Note: groupToEdit.Note || '',
        });
      } else if (isEditMode) {
        // If we're in edit mode but don't have group data, go back
        router.back();
        return;
      } else {
        reset({
          GroupName: '',
          CompanyName: '',
          Note: '',
        });
      }
      setIsInitialized(true);
    }
  }, [groupToEdit, isEditMode, reset, router, isInitialized]);

  const onSubmit = async (data: GroupFormData) => {
    if (isEditMode && groupToEdit) {
      await onUpdateGroup({
        ...data,
        GroupId: groupToEdit.GroupId,
      });
      clearGroupToEdit();
      router.back();
    } else {
      await onAddGroup(data);
      router.back();
    }
  };

  return (
    <div className="min-h-screen w-full py-8 px-4">
      <div className="w-full max-w-screen-md mx-auto py-8">
        <div className="flex items-center mb-6">
          <Link
            onClick={() => clearGroupToEdit()}
            href="/connections"
            className="flex items-center text-[--main-color1] gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7-11-11 11-11 7 7 7 7" />
            </svg>
            <h1 className="text-h1 font-bold text-center">{isEditMode ? 'Edit Group' : 'Create Group'}</h1>
          </Link>
        </div>

        <form noValidate className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              control={control}
              name="GroupName"
              type="text"
              placeholder="Enter group name"
              label="Name"
              icon={
                <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              }
            />

            <TextInput
              control={control}
              name="CompanyName"
              type="text"
              placeholder="Enter company name"
              label="Company"
              icon={
                <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
                </svg>
              }
            />

            <TextArea
              control={control}
              name="Note"
              placeholder="Add any additional notes"
              label="Note (Optional)"
              icon={
                <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
              }
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-[var(--main-color1)] hover:bg-[var(--liner-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-color1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : isEditMode ? 'Update Group' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
