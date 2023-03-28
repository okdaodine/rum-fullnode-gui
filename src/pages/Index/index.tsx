import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStore } from 'store';
import sleep from 'utils/sleep';
import Loading from 'components/Loading';
import Button from 'components/Button';
import { GoChevronRight } from 'react-icons/go';
import classNames from 'classnames';

export default observer(() => {
  const state = useLocalObservable(() => ({
    loading: true
  }));
  const { snackbarStore, confirmDialogStore } = useStore();

  React.useEffect(() => {
    (async () => {
      sleep(2000);
      state.loading = false;
    })()
  }, []);

  if (state.loading) {
    return <Loading />
  }

  const openSnackbar = () => {
    snackbarStore.show({
      message: '这是 snackbar',
      duration: 3000,
    });
  }

  const openConfirmDialog = () => {
    confirmDialogStore.show({
      content: '这是 confirmDialog',
      okText: '确定',
      ok: () => {
        confirmDialogStore.hide();
      },
    });
  }

  return (
    <div className="w-[1000px] h-screen mx-auto flex items-stretch py-8 text-white/80">
      <div className="border border-white/25 flex flex-1 items-stretch rounded-12">
        <div className="w-[240px] border-r border-white/25 overflow-auto relative">
          <div className="flex items-center justify-between py-5 pl-5 pr-3 absolute top-0 right-0 left-0 leading-none">
            <div className="text-20 font-bold text-white/90">Groups</div>
            <div className="flex items-center">
              <Button size='mini' outline>Join</Button>
              <Button size='mini' className="ml-2" outline>Add</Button>
            </div>
          </div>
          <div className="pt-[62px]">
            <div className="border-t border-white/10" />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(item => (
              <div
                key={item}
                className={classNames("py-2 px-4 border-b border-white/10 cursor-pointer hover:bg-white/5", {
                  'bg-white/5': item === 5
                })}>
                去中心微博 {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-5 relative overflow-auto">
          <div className="absolute top-0 left-0 right-0 py-3 border-b border-white/25 leading-none pl-6 pr-5 flex justify-between items-center">
            <div>
              <div className="text-18 font-bold tracking-widest text-white/90">去中心微博 1</div>
              <div className="mt-2 text-12 opacity-60 tracking-wider">Owner</div>
            </div>
            <div>
              <Button size='mini' outline>Delete</Button>
            </div>
          </div>
          <div className="mt-[62px] pt-5">
            <div className="flex w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90">
              <div className="text-14 tracking-wider">Group Info</div>
              <GoChevronRight className="text-20 opacity-70" />
            </div>
            <div className="mt-5 flex w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90">
              <div className="text-14 tracking-wider">Seed URL</div>
              <div className="text-orange-500/90 mr-1">Copy</div>
            </div>
            <div className="mt-5 flex w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90">
              <div className="text-14 tracking-wider">Chain Token</div>
              <div className="text-orange-500/90 mr-1">Create</div>
            </div>
            <div className="mt-5 flex w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90">
              <div className="text-14 tracking-wider">Node Token</div>
              <div className="text-orange-500/90 mr-1">Create</div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-[22px] left-[50%] ml-[510px] py-2 px-4 opacity-80">
        <Button size='mini' outline>
          <span className="px-2">Log Out</span>
        </Button>
      </div>
      <div className="fixed bottom-2 w-[1000px] text-center text-12 text-white/50 tracking-wider">
        This is just a GUI tool that will not store any of your fullnode data.
      </div>
    </div>
  )
});
