import { IoMdClose } from 'react-icons/io';
import { Dialog, DialogProps } from '@material-ui/core';

interface IProps extends DialogProps {
  hideCloseButton?: boolean
  useDialog?: boolean
}

export default (props: IProps) => {
  const { hideCloseButton, useDialog, ...DialogProps } = props;
  
  return (
    <Dialog
      {...DialogProps}
      maxWidth={false}
      PaperProps={{
        className: "bg-[#181818] text-white text-opacity-80 rounded-12"
      }}
      className="flex items-center justify-center">
      <div>
        {!hideCloseButton && (
          <div
            className="text-white text-opacity-80 text-22 p-4 top-0 right-0 absolute cursor-pointer z-10"
            onClick={props.onClose as any}
            data-test-id="dialog-close-button"
          >
            <IoMdClose />
          </div>
        )}
        {props.children}
      </div>
    </Dialog>
  );
};
