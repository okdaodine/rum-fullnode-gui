import { observer, useLocalObservable } from 'mobx-react-lite';
import Modal from 'components/Modal';
import { TextField } from '@material-ui/core';
import Button from 'components/Button';
import { BiChevronRight } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { useStore } from 'store';
import sleep from 'utils/sleep';
import { IApiConfig } from 'store/apiConfig';

interface IProps {
  open: boolean
  onClose: () => void
}


const Main = observer((props: IProps) => {
  const { apiConfigStore, confirmDialogStore } = useStore();
  const state = useLocalObservable(() => ({
    apiConfig: {
      baseURL: '',
      jwt: '',
    }
  }));

  const submit = async (apiConfig: IApiConfig) => {
    if (
      window.origin.startsWith('https://') &&
      apiConfig.baseURL.startsWith('http://') &&
      !/localhost|127.0.0.1/.test(apiConfig.baseURL)
    ) {
      confirmDialogStore.show({
        content: `Https website can not access http url. <br />Please use https url or use http website.`,
        okText: 'Use http',
        ok: async () => {
          confirmDialogStore.hide();
          await sleep(400);
          window.location.href = 'http://http.gui.node.rumsystem.net/';
        },
      });
      return;
    }
    props.onClose();
    await sleep(150);
    apiConfigStore.setApiConfig(apiConfig);
    apiConfigStore.addApiConfigToHistory(apiConfig);
    window.location.reload();
  }

  return (
    <div className="w-[300px] p-8 px-10 text-center">
      <div className="text-18 font-bold leading-none">Connect Node</div>
      <div className="pt-5">
        <TextField
          className="w-full"
          placeholder="http://127.0.0.1:8002"
          size="small"
          value={state.apiConfig.baseURL}
          onChange={(e) => { state.apiConfig.baseURL = e.target.value.trim(); }}
          margin="dense"
          variant="outlined"
        />
      </div>
      <div className="pt-2">
        <TextField
          className="w-full"
          placeholder={`Chain token (optional)`}
          size="small"
          value={state.apiConfig.jwt}
          onChange={(e) => { state.apiConfig.jwt = e.target.value.trim(); }}
          margin="dense"
          variant="outlined"
        />
      </div>
      <div className="mt-6" onClick={() => submit(state.apiConfig)}>
        <Button fullWidth disabled={!state.apiConfig.baseURL}>Ok</Button>
      </div>
      {apiConfigStore.apiConfigHistory.length > 0 && (
        <>
          <div className="text-white/40 mt-5 text-12">👇 History from LocalStorage 👇</div>
          <div className="max-h-[228px] overflow-y-auto px-2 -mt-1">
            {apiConfigStore.apiConfigHistory.map((apiConfig) => {
              if (!apiConfig.baseURL) {
                return null;
              }
              return (
                <div
                  key={`${apiConfig.baseURL}${apiConfig.jwt}`}
                  className="mt-4 border border-white/20 px-4 py-3 flex items-center justify-between rounded-10 cursor-pointer text-left relative group"
                  onClick={() => {
                    submit(apiConfig);
                  }}
                >
                  <div className="text-white/40 font-bold">{apiConfig.baseURL}</div>
                  <div className="text-18">
                    <BiChevronRight className="text-white/40" />
                  </div>
                  <div
                    className="bg-white bg-opacity-70 text-black opacity-60 text-14 top-[-12px] right-[-10px] absolute cursor-pointer rounded-full w-6 h-6 items-center justify-center hidden group-hover:flex"
                    onClick={(e) => {
                      e.stopPropagation();
                      apiConfigStore.removeApiConfigToHistory(apiConfig);
                    }}
                  >
                    <IoMdClose />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  )
});

export default observer((props: IProps) => (
  <Modal hideCloseButton open={props.open} onClose={() => props.onClose()}>
    <Main {...props} />
  </Modal>
));
