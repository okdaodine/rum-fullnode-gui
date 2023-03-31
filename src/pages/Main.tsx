import { observer, useLocalObservable } from 'mobx-react-lite';
import Button from 'components/Button';
import { GoChevronRight } from 'react-icons/go';
import { IGroup } from 'rum-fullnode-sdk/src/apis/group';
import { useStore } from 'store';
import RumFullNodeClient from 'rum-fullnode-sdk';
import copy from 'copy-to-clipboard';
import sleep from 'utils/sleep';
import openGroupInfo from './openGroupInfo';
import listContents from './listContents';
import CreateTrxModal from './CreateTrxModal';

interface IProps {
  group: null | IGroup,
  removeGroup: (group: IGroup) => void,
}

export default observer((props: IProps) => {
  const { apiConfigStore, snackbarStore, confirmDialogStore } = useStore();
  const state = useLocalObservable(() => ({
    openCreateTrxModal: false
  }));
  
  if (!props.group) {
    return null;
  }

  const isOwner = props.group.owner_pubkey === props.group.user_pubkey;

  const leave = async () => {
    confirmDialogStore.show({
      content: 'Are you sure to leave ?',
      ok: async () => {
        try {
          const client = RumFullNodeClient(apiConfigStore.apiConfig!);
          client.Group.leave(props.group!.group_id);
          props.removeGroup(props.group!);
          confirmDialogStore.hide();
          await sleep(400);
          snackbarStore.show({
            message: 'Done',
          });
        } catch (err) {
          console.log(err);
          snackbarStore.show({
            message: 'Something wrong',
            type: 'error',
          });
        }
      },
    });
  }

  const copySeed = async () => {
    try {
      const client = RumFullNodeClient(apiConfigStore.apiConfig!);
      const { seed } = await client.Group.getSeed(props.group!.group_id);
      copy(seed);
      snackbarStore.show({
        message: 'Copied',
      });
    } catch (err) {
      console.log(err);
      snackbarStore.show({
        message: 'Something wrong',
        type: 'error',
      });
    }
  }

  const createNodeToken = async () => {
    try {
      const client = RumFullNodeClient(apiConfigStore.apiConfig!);
      const { token } = await client.Token.create({
        allow_groups: [props.group!.group_id],
        expires_at: '2100-01-01T00:00:00.675204+00:00',
        name: `${Date.now()}`,
        role: 'node',
      });
      confirmDialogStore.show({
        content: `<div class="text-12 break-words">${token}</div>`,
        cancelDisabled: true,
        okText: 'Copy',
        ok: async () => {
          copy(token);
          confirmDialogStore.hide();
          await sleep(400);
          snackbarStore.show({
            message: 'Copied',
          });
        },
      });
    } catch (err) {
      console.log(err);
      snackbarStore.show({
        message: 'Something wrong',
        type: 'error',
      });
    }
  }

  return (
    <div className="flex-1 p-5 relative overflow-auto">
      <div className="absolute top-0 left-0 right-0 py-3 border-b border-white/25 leading-none pl-6 pr-5 flex justify-between items-center">
        <div>
          <div className="text-18 font-bold tracking-widest text-white/90">{props.group.group_name}</div>
          <div className="mt-2 text-12 opacity-60 tracking-wider">{isOwner ? 'Owner' : 'User'}</div>
        </div>
        <div className="opacity-80">
          <Button size='mini' outline onClick={leave}>Leave</Button>
        </div>
      </div>
      <div className="mt-[62px] pt-5">
        <div className="flex w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90" onClick={() => openGroupInfo(props.group!)}>
          <div className="text-14 tracking-wider">Group Info</div>
          <div className="text-orange-500/90 mr-1">Open</div>
        </div>
        <div className="mt-5 flex w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90" onClick={copySeed}>
          <div className="text-14 tracking-wider">Seed URL</div>
          <div className="text-orange-500/90 mr-1">Copy</div>
        </div>
        <div className="mt-5 flex w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90" onClick={() => { state.openCreateTrxModal = true; }}>
          <div className="text-14 tracking-wider">Trx</div>
          <div className="text-orange-500/90 mr-1">Create</div>
        </div>
        <div className="mt-5 flex w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90" onClick={() => { listContents(props.group!) }}>
          <div className="text-14 tracking-wider">Last 10 trxs</div>
          <div className="text-orange-500/90 mr-1">List</div>
        </div>
        {isOwner && (
          <div className="mt-5 w-[450px] mx-auto py-2 px-6 cursor-pointer items-center justify-between bg-white/5 rounded-12 text-white/90 hidden" onClick={() => createNodeToken()}>
            <div className="text-14 tracking-wider">Node Token</div>
            <div className="text-orange-500/90 mr-1">Create</div>
          </div>
        )}
      </div>

      <CreateTrxModal
        groupId={props.group.group_id}
        open={state.openCreateTrxModal}
        onClose={() => state.openCreateTrxModal = false}
      />
    </div>
  )
});
