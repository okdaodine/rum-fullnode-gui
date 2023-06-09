import { observer } from 'mobx-react-lite';
import Loading from 'components/Loading';
import { useStore } from 'store';

export default observer(() => {
  const { pageLoadingStore } = useStore();

  if (!pageLoadingStore.open) {
    return null;
  }

  return (
    <div className="root fixed top-0 left-0 w-screen h-screen bg-white dark:bg-[#181818] flex items-center justify-center z-[9999]">
      <div className="mt-[-20vh]">
        <Loading />
      </div>
    </div>
  );
});
