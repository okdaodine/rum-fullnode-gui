import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { StoreProvider } from 'store';
import Loading from 'components/Loading';
import { useStore } from 'store';
import Modal from 'components/Modal';
import { IGroup } from 'rum-fullnode-sdk/src/apis/group';
import { IContentItem } from 'rum-fullnode-sdk/src/apis/content';
import RumFullNodeClient from 'rum-fullnode-sdk';

interface IModalProps {
  group: IGroup
  rs: (result: boolean) => void
}

const Main = observer((props: IModalProps) => {
  const { snackbarStore, apiConfigStore } = useStore();
  const state = useLocalObservable(() => ({
    contents: [] as IContentItem[],
    loading: true,
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
        const client = RumFullNodeClient(apiConfigStore.apiConfig!);
        const contents = await client.Content.list(props.group.group_id, {
          num: 10,
          reverse: true
        });
        state.contents = contents || [];
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
            <div className="py-56">
              <Loading />
            </div>
          )}
          {!state.loading && (
            <>
              <div className="text-18 font-bold text-center pb-10 leading-none">Last 10 trxs</div>
              <div className="-mt-3 justify-center bg-gray-100 dark:bg-black dark:bg-opacity-70 rounded-0 pt-3 px-4 md:px-6 pb-3 leading-7 tracking-wide text-left overflow-auto text-12">
                <pre dangerouslySetInnerHTML={{ __html: JSON.stringify(state.contents, null, 2) }} />
              </div>
            </>
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