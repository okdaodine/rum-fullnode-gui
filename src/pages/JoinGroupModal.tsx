import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Modal from 'components/Modal';
import { TextField } from '@material-ui/core';
import Button from 'components/Button';
import RumFullNodeClient  from 'rum-fullnode-sdk';
import { IGroup } from 'rum-fullnode-sdk/src/apis/group';
import { useStore } from 'store';
import sleep from 'utils/sleep';

interface IProps {
  open: boolean
  onClose: () => void
  addGroup: (group: IGroup) => void
}

const Main = observer((props: IProps) => {
  const { snackbarStore, apiConfigStore } = useStore();
  const state = useLocalObservable(() => ({
    seedUrl: '',
    submitting: false
  }));
 
  const submit = async () => {
    if (state.submitting) {
      return;
    }
    state.submitting = true;
    try {
      const client = RumFullNodeClient(apiConfigStore.apiConfig!);
      const groupRes = await client.Group.join(state.seedUrl);
      const group = ((await client.Group.list()).groups || []).find(item => item.group_id === groupRes.group_id)!;
      await sleep(400);
      state.submitting = false;
      await sleep(400);
      props.onClose();
      await sleep(400);
      props.addGroup(group);
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
    state.submitting = false;
  }

  return (
    <div className="bg-white dark:bg-[#181818] py-8 px-10 w-[350px] box-border">
      <div className="text-18 font-bold dark:text-white dark:text-opacity-80 text-gray-700 text-center">Join Group</div>
      <div className="pt-4 relative">
        <TextField
          className="w-full"
          placeholder="Seed URL"
          size="small"
          multiline
          minRows={6}
          maxRows={6}
          value={state.seedUrl}
          autoFocus
          onChange={(e) => { state.seedUrl = e.target.value.trim() }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
              submit();
            }
          }}
          margin="dense"
          variant="outlined"
        />
        <div className="mt-4 flex justify-center">
          <Button
            fullWidth
            isDoing={state.submitting}
            disabled={!state.seedUrl}
            onClick={submit}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  )
});

export default observer((props: IProps) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Main { ...props } />
    </Modal>
  );
});
