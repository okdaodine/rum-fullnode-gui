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
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { isMobile } from 'utils/env';
import { AiOutlineGithub } from 'react-icons/ai';

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

  const disconnect = () => {
    confirmDialogStore.show({
      content: 'Are you sure to disconnect ?',
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

  if (isMobile) {
    return (
      <div className="pt-[40vh] text-center text-white/40">
        This app is not available in mobile.
      </div>
    )
  }

  return (
    <div className="w-[1000px] h-screen mx-auto flex items-stretch py-8 text-white/80">
      {!apiConfigStore.apiConfig && (
        <div className="text-[28px] w-[1000px] mx-auto pt-20 text-white/80 ">
          <img src="/dashboard.fullnode.png" alt="logo" className="w-[100px] h-[100px] rounded-full mx-auto opacity-80" />
          <div className="text-[50px] font-extrabold text-orange-400 text-center leading-tight pt-8 tracking-wider">
            Pure<span className="opacity-60">,</span> Secure<span className="opacity-60">,</span> Fast <br /><span className="mt-5 text-[32px] opacity-80">GUI for quorum fullnode.</span>
          </div>
      
          <div className="py-3 px-4 rounded-xl opacity-50 mt-5 text-14 flex items-center leading-none justify-center">
            <AiOutlineInfoCircle className="mr-2 text-18" />This GUI will not store any data of your fullnode.
          </div>
      
          <div className="mt-12 flex justify-center font-bold">
            <Button size='large' onClick={() => {
                state.openLoginModal = true;
              }}>
              <span className="tracking-wider text-[18px] py-1">Connect</span>
            </Button>
          </div>
        </div>
      )}
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
            <Button size='mini' outline onClick={disconnect}>
              <span className="px-2">Disconnect</span>
            </Button>
          </div>
          <div className="fixed top-2 w-[1000px] text-center text-12 text-white/50 tracking-wider flex items-center justify-between">
            <div className="text-12 leading-none flex items-center tracking-widest justify-start"><BiRadioCircleMarked className="mr-1 text-18 text-orange-500" />{apiConfigStore.apiConfig.baseURL}</div>
            <div className="text-12 leading-none flex items-center tracking-widest justify-start cursor-pointer" onClick={openNetwork}><BsWifi className="mr-2 text-18 text-orange-500" />Network</div>
          </div>
          <div className="fixed bottom-2 w-[1000px] text-center text-12 text-white/50 tracking-wider">
            This GUI will not store any data of your fullnode.
          </div>
        </>
      )}
      <LoginModal open={state.openLoginModal} onClose={() => state.openLoginModal = false} />

      <div
        className='fixed bottom-10 right-10 w-10 h-10 mx-auto rounded-full hidden md:flex items-center justify-center cursor-pointer border dark:border-white dark:md:border-opacity-10 dark:border-opacity-[0.05] border-gray-c4'
        onClick={() => {
          window.open('https://github.com/okdaodine/rum-fullnode-gui');
        }}
      >
        <AiOutlineGithub className="text-20 dark:text-white dark:text-opacity-80 text-gray-af" />
      </div>
    </div>
  )
});
