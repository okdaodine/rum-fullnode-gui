import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStore } from 'store';
import sleep from 'utils/sleep';
import Button from 'components/Button';
import { BiRadioCircleMarked } from 'react-icons/bi';
import { BsWifi } from 'react-icons/bs';
import Sidebar from './Sidebar';
import Main from './Main';
import LoginModal from './LoginModal';
import { IGroup } from 'rum-fullnode-sdk/dist/apis/group';
import RumFullNodeClient from 'rum-fullnode-sdk';
import openNetwork from './openNetwork';

export default observer(() => {
  const { apiConfigStore, confirmDialogStore, pageLoadingStore } = useStore();
  const state = useLocalObservable(() => ({
    loading: true,
    openLoginModal: false,
    groups: [] as IGroup[],
    activeGroup: null as null | IGroup,
  }));

  React.useEffect(() => {
    (async () => {
      try {
        pageLoadingStore.show();
        await sleep(500);
        if (apiConfigStore.apiConfig) {
          const client = RumFullNodeClient(apiConfigStore.apiConfig);
          state.groups = (await client.Group.list()).groups || [];
        } else {
          state.openLoginModal = true;
        }
        state.loading = false;
      } catch (err) {
        console.log(err);
        confirmDialogStore.show({
          content: `Could not connect to node <span class="font-bold">${apiConfigStore.apiConfig?.baseURL}</span>`,
          cancelText: 'Back',
          okText: 'Reload',
          cancel: async () => {
            confirmDialogStore.hide();
            await sleep(400);
            apiConfigStore.setApiConfig(null);
            window.location.reload();
          },
          ok: async () => {
            confirmDialogStore.hide();
            await sleep(400);
            window.location.reload();
          },
        });
      }
      pageLoadingStore.hide();
    })()
  }, []);

  const logout = () => {
    confirmDialogStore.show({
      content: 'Are you sure to log out ?',
      ok: async () => {
        confirmDialogStore.hide();
        await sleep(400);
        apiConfigStore.setApiConfig(null);
        window.location.reload();
      },
    });
  }

  const addGroup = (group: IGroup) => {
    state.groups.push(group);
    state.activeGroup = group;
  }

  if (state.loading) {
    return null;
  }

  return (
    <div className="w-[1000px] h-screen mx-auto flex items-stretch py-8 text-white/80">
      {apiConfigStore.apiConfig && (
        <>
          <div className="border border-white/25 flex flex-1 items-stretch rounded-12">
            <Sidebar
              groups={state.groups}
              addGroup={addGroup}
              activeGroup={state.activeGroup}
              setActiveGroup={(group) => {
                state.activeGroup = group;
              }}
            />
            <Main
              group={state.activeGroup}
              removeGroup={group => {
                state.groups = state.groups.filter(item => item.group_id !== group.group_id);
                if (state.activeGroup === group) {
                  state.activeGroup = null;
                }
              }}
            />
          </div>
          <div className="fixed bottom-[22px] left-[50%] ml-[510px] py-2 px-4 opacity-80">
            <Button size='mini' outline onClick={logout}>
              <span className="px-2">Log Out</span>
            </Button>
          </div>
          <div className="fixed top-2 w-[1000px] text-center text-12 text-white/50 tracking-wider flex items-center justify-between">
            <div className="text-12 leading-none flex items-center tracking-widest justify-start"><BiRadioCircleMarked className="mr-1 text-18 text-orange-500" />{apiConfigStore.apiConfig.baseURL}</div>
            <div className="text-12 leading-none flex items-center tracking-widest justify-start cursor-pointer" onClick={openNetwork}><BsWifi className="mr-2 text-18 text-orange-500" />Network</div>
          </div>
          <div className="fixed bottom-2 w-[1000px] text-center text-12 text-white/50 tracking-wider">
            This is just a GUI tool that will not store any of your fullnode data.
          </div>
        </>
      )}
      <LoginModal open={state.openLoginModal} onClose={() => state.openLoginModal = false} />
    </div>
  )
});
