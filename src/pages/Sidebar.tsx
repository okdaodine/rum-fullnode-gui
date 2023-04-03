import { observer, useLocalObservable } from 'mobx-react-lite';
import Button from 'components/Button';
import classNames from 'classnames';
import AddGroupModal from './AddGroupModal';
import JoinGroupModal from './JoinGroupModal';
import { IGroup } from 'rum-fullnode-sdk/src/apis/group';

interface IProps {
  activeGroup: null | IGroup,
  setActiveGroup: (group: IGroup) => void,
  groups: IGroup[],
  addGroup: (group: IGroup) => void
}

export default observer((props: IProps) => {
  const state = useLocalObservable(() => ({
    openAddGroupModal: false,
    openJoinGroupModal: false,
  }));

  return (
    <div className="w-[240px] border-r border-white/25 overflow-auto relative">
      <div className="flex items-center justify-between py-5 pl-5 pr-3 absolute top-0 right-0 left-0 leading-none">
        <div className="text-20 font-bold text-white/90">Groups</div>
        <div className="flex items-center">
          <Button size='mini' outline onClick={() => {
            state.openJoinGroupModal = true;
          }}>Join</Button>
          <Button size='mini' className="ml-2" outline onClick={() => {
            state.openAddGroupModal = true;
          }}>Add</Button>
        </div>
      </div>
      <div className="pt-[62px]">
        <div className="border-t border-white/10" />
        {props.groups.map((group, index) => (
          <div
            key={group.group_id}
            className={classNames("py-2 px-4 border-b border-white/10 cursor-pointer hover:bg-white/5 truncate", {
              'bg-white/5': group.group_id === props.activeGroup?.group_id
            })}
            onClick={() => {
              props.setActiveGroup(group);
            }}>
            {group.group_name}
          </div>
        ))}
      </div>
      <AddGroupModal
        open={state.openAddGroupModal}
        onClose={() => state.openAddGroupModal = false}
        addGroup={props.addGroup}
      />
      <JoinGroupModal
        open={state.openJoinGroupModal}
        onClose={() => state.openJoinGroupModal = false}
        addGroup={props.addGroup}
      />
    </div>
  )
});
