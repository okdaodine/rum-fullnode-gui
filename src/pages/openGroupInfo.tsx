import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { StoreProvider } from 'store';
import Loading from 'components/Loading';
import { useStore } from 'store';
import Modal from 'components/Modal';
import { IGroup } from 'rum-fullnode-sdk/src/apis/group';

interface IModalProps {
  group: IGroup
  rs: (result: boolean) => void
}

const Main = observer((props: IModalProps) => {
  const { snackbarStore } = useStore();
  const state = useLocalObservable(() => ({
    group: {} as IGroup,
    loading: false,
    open: false,
  }));

  React.useEffect(() => {
    setTimeout(() => {
      state.open = true;
    });
  }, []);
  
  React.useEffect(() => {
    (async () => {
      try {
        // const group = await GroupApi.get(props.groupId);
        // state.group = group;
        // console.log(`[]:`, { group });
        state.group = props.group;
      } catch (err) {
        console.log(err);
        snackbarStore.show({
          message: 'something wrong',
          type: 'error',
        });
      }
      state.loading = false;
    })();
  }, []);

  const handleClose = (result: any) => {
    state.open = false;
    props.rs(result);
  };

  return (
    <Modal open={state.open} onClose={() => handleClose(false)}>
      <div className="h-[90vh] overflow-y-auto  p-8 px-5 md:px-10 box-border">
        <div className="w-full md:w-[540px]">
          {state.loading && (
            <div className="py-32">
              <Loading />
            </div>
          )}
          {!state.loading && (
            <div>
              <div className="text-18 font-bold dark:text-white dark:text-opacity-80 text-gray-700 text-center">
                <div className="flex items-center justify-center">
                  {state.group.group_name}
                </div>
                <div className="mt-1 text-12 opacity-40">
                  {state.group.group_id}
                </div>
              </div>
              <div className="mt-8">
                <div className="-mt-3 justify-center bg-gray-100 dark:bg-black dark:bg-opacity-70 rounded-0 pt-3 px-4 md:px-6 pb-3 leading-7 tracking-wide text-left overflow-auto text-12">
                  <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(state.group, null, 2) }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
});

export default async (group: IGroup) => new Promise((rs) => {
  const div = document.createElement('div');
  document.body.append(div);
  const unmount = () => {
    unmountComponentAtNode(div);
    div.remove();
  };
  render(
    (
      <StoreProvider>
        <Main
          group={group}
          rs={(result: any) => {
            rs(result);
            setTimeout(unmount, 500);
          }}
        />
      </StoreProvider>
    ),
    div,
  );
});