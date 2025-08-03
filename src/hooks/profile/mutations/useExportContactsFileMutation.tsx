import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import SnackbarUtils from 'utils/SnackbarUtils';



export function useExportContactsFileMutation() {

  const mutation = useMutation({
    mutationKey: [ProfileService.exportContactsFile.mutationKey],
    mutationFn: ProfileService.exportContactsFile.request,
    onSuccess: async response => {
      if (!response.sucess) {
        SnackbarUtils.error('Failed to export contacts file');
        return;
      }
      const blob = await fetch(response.filePath).then(res => res.blob());
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.fileName;
      link.click();
      URL.revokeObjectURL(url);

      SnackbarUtils.success('Contacts file exported successfully');
    },
  });

  const onExportContactsFile = () => {
    return mutation.mutate();
  };

  return {
    ...mutation,
    isLoading: mutation.isPending,
    onExportContactsFile,
  };
}
