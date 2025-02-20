import { useMutation } from '@tanstack/react-query';
import { CategoriesService } from 'api';
import { useIsLoadingMutation } from 'hooks';
import { Category } from 'types';

interface SelectOption {
  label: string;
  value: string;
}

export function useGetAllCategoriesMutation() {
  const mutation = useMutation({
    mutationKey: [CategoriesService.getCategories.mutationKey],
    mutationFn: CategoriesService.getCategories.request,
  });

  const formatCategoriesForSelect = (categories: Category[] = [], locale: string): SelectOption[] => {
    return categories.map(category => ({
      label: locale === 'en' ? category.Name : category.NameAr,
      value: category.Code
    }));
  };

  const onGetCategories = (locale: string = 'en') => {
    return mutation.mutate(undefined, {
      onSuccess: (response) => {
        if (response) {
          return formatCategoriesForSelect(response, locale);
        }
        return [];
      }
    });
  };

  const { isLoading } = useIsLoadingMutation(CategoriesService.getCategories.mutationKey);

  return {
    ...mutation,
    isLoading,
    onGetCategories,
    getSelectOptions: (locale: string = 'en') =>
      mutation.data ? formatCategoriesForSelect(mutation.data, locale) : []
  };
}
