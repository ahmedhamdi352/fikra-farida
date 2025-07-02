import LoadingSpinner from './LoadingSpinner';
import { useTranslations } from 'next-intl';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  const t = useTranslations('common');

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-[rgba(217,217,217,0.05)] p-8 rounded-lg shadow-[0px_0px_0px_1px_rgba(217,217,217,0.50)] backdrop-blur-[25px] flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" color="#FEC400" />
        <span className="text-[#FEC400] font-medium">{t('loading')}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
