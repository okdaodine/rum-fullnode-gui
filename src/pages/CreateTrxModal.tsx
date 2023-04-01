import { observer, useLocalObservable } from 'mobx-react-lite';
import Modal from 'components/Modal';
import { TextField } from '@material-ui/core';
import Button from 'components/Button';
import RumFullNodeClient  from 'rum-fullnode-sdk';
import { useStore } from 'store';
import sleep from 'utils/sleep';

interface IProps {
  groupId: string
  open: boolean
  onClose: () => void
}

const Main = observer((props: IProps) => {
  const { snackbarStore, apiConfigStore, confirmDialogStore } = useStore();
  const state = useLocalObservable(() => ({
    data: '',
    submitting: false
  }));
 
  const submit = async () => {
    let json: any;
    try {
      json = JSON.parse(state.data);
    } catch (err) {
      console.log(err);
      snackbarStore.show({
        message: 'Invalid json',
        type: 'error',
      });
      return;
    }
    if (state.submitting) {
      return;
    }
    state.submitting = true;
    try {
      const client = RumFullNodeClient(apiConfigStore.apiConfig!);
      const res = await client.Content.create(props.groupId, json);
      console.log(res);
      await sleep(400);
      state.submitting = false;
      props.onClose();
      await sleep(400);
      confirmDialogStore.show({
        content: `Done. Trx id 👇 <br /><span class="text-12 opacity-60 whitespace-nowrap">${res.trx_id}</span>`,
        cancelDisabled: true,
        ok: () => {
          confirmDialogStore.hide();
        },
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
      <div className="text-18 font-bold dark:text-white dark:text-opacity-80 text-gray-700 text-center">Create Trx</div>
      <div className="pt-4 relative">
        <TextField
          className="w-full"
          placeholder={`Trx data. For example { "foo": "bar" }`}
          size="small"
          multiline
          minRows={6}
          maxRows={6}
          value={state.data}
          autoFocus
          onChange={(e) => { state.data = e.target.value.trim() }}
          margin="dense"
          variant="outlined"
        />
        <div className="mt-4 flex justify-center">
          <Button
            fullWidth
            isDoing={state.submitting}
            disabled={!state.data}
            onClick={submit}
          >
            Create
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
