import { observer, useLocalObservable } from 'mobx-react-lite';
import Modal from 'components/Modal';
import { TextField } from '@material-ui/core';
import Button from 'components/Button';
import RumFullNodeClient  from 'rum-fullnode-sdk';
import { useStore } from 'store';
import sleep from 'utils/sleep';
import { IGroup } from 'rum-fullnode-sdk/src/apis/group';
import { utils as RumSdkUtils } from 'rum-sdk-browser';

interface IProps {
  group: IGroup,
  open: boolean
  onClose: () => void
}

const Main = observer((props: IProps) => {
  const { snackbarStore, apiConfigStore, confirmDialogStore } = useStore();
  const state = useLocalObservable(() => ({
    trxId: '',
    loading: false,
  }));
 
  const submit = async () => {
    state.loading = true;
    try {
      const client = RumFullNodeClient(apiConfigStore.apiConfig!);
      const res = await client.Trx.get(props.group.group_id, state.trxId);
      await sleep(400);
      console.log(res);
      if (Object.keys(res || {}).length === 0) {
        snackbarStore.show({
          message: 'Trx not found',
          type: 'error',
        });
        state.loading = false;
        return;
      }
      try {
        const encryptedBuffer = RumSdkUtils.Base64.toUint8Array(res.Data);
        const buffer = await RumSdkUtils.AEScrypto.decrypt(encryptedBuffer, props.group.cipher_key);
        const dataString = RumSdkUtils.typeTransform.uint8ArrayToString(buffer);
        res.Data = JSON.parse(dataString);
      } catch (err) {
        console.log(err);
      }
      props.onClose();
      await sleep(400);
      confirmDialogStore.show({
        content: `
          <div class="-mt-3 justify-center bg-gray-100 dark:bg-black dark:bg-opacity-70 rounded-0 pt-3 px-4 md:px-6 pb-3 leading-7 tracking-wide text-left overflow-auto text-12">
            <pre>${JSON.stringify(res, null, 2)}</pre>
          </div>`,
        contentClassName: 'md:max-w-[500px]',
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
    state.loading = false;
  }

  return (
    <div className="bg-white dark:bg-[#181818] py-8 px-10 w-[350px] box-border">
      <div className="text-18 font-bold dark:text-white dark:text-opacity-80 text-gray-700 text-center">Get Trx</div>
      <div className="pt-4 relative">
        <TextField
          className="w-full"
          placeholder="Trx Id"
          size="small"
          value={state.trxId}
          autoFocus
          onChange={(e) => { state.trxId = e.target.value.trim() }}
          margin="dense"
          variant="outlined"
        />
        <div className="mt-6 flex justify-center">
          <Button
            fullWidth
            isDoing={state.loading}
            disabled={!state.trxId}
            onClick={submit}
          >
            Get
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
