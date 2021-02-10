import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import {Avatar, message, Popconfirm, Popover, Tag, Tooltip} from 'antd';
import {BgColorsOutlined, CreditCardOutlined, DeleteTwoTone, DollarOutlined, MoreOutlined,} from '@ant-design/icons';
import {deleteTransaction, updateTransactionColorSettingShown} from '../../features/transactions/actions';
import {Label} from '../../features/label/interface';
import {Transaction} from '../../features/transactions/interface';
import './project-item.styles.less';
import moment from 'moment-timezone';
import {IState} from '../../store';
import {ProjectItemUIType, ProjectType} from '../../features/project/constants';
//import modal
import ShareProjectItem from '../modals/share-project-item.component';
import MoveProjectItem from '../modals/move-project-item.component';
import EditTransaction from '../modals/edit-transaction.component';
import {getIcon, getItemIcon,} from '../draggable-labels/draggable-label-list.component';
import {setSelectedLabel} from '../../features/label/actions';
import {User} from "../../features/group/interface";
import {animation, IconFont, Item, Menu, MenuProvider} from "react-contexify";
import {theme as ContextMenuTheme} from "react-contexify/lib/utils/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import {CopyOutlined} from "@ant-design/icons/lib";
import {convertToTextWithRRule} from "../../features/recurrence/actions";
import {stringToRGB} from "../../utils/Util";

const LocaleCurrency = require('locale-currency'); //currency code

type TransactionProps = {
  inProject: boolean;
  currency: string;
  theme: string;
  setSelectedLabel: (label: Label) => void;
  showModal?: (user: User) => void;
  updateTransactionColorSettingShown: (
    visible: boolean
  ) => void;
};

type TransactionManageProps = {
  inModal?: boolean;
  transaction: Transaction;
  type: ProjectItemUIType;
  deleteTransaction: (transactionId: number, type: ProjectItemUIType, dateTime?: string) => void;
};

const ManageTransaction: React.FC<TransactionManageProps> = (props) => {
  const { transaction, deleteTransaction, inModal, type } = props;

    const getPopConfirmForDelete = (transaction: Transaction) => {
        if (!transaction.date || !transaction.recurrenceRule) {
            // recurring or single occurrence
            return <Popconfirm
                title='Are you sure?'
                okText='Yes'
                cancelText='No'
                className='group-setting'
                placement='bottom'
                onConfirm={() => deleteTransaction(transaction.id, type)}
            >
                <div className='popover-control-item'>
                    <span>Delete</span>
                    <DeleteTwoTone twoToneColor='#f5222d'/>
                </div>
            </Popconfirm>
        }

        return <Popconfirm
            title="One Time Only or All Events"
            okText="Series"
            cancelText="Occurrence"
            className='group-setting'
            placement='bottom'
            onConfirm={() => deleteTransaction(transaction.id, type)}
            onCancel={() => deleteTransaction(transaction.id, type, transaction.date + ' ' + transaction.time)}
        >
            <div className='popover-control-item'>
                <span>Delete</span>
                <DeleteTwoTone twoToneColor='#f5222d'/>
            </div>
        </Popconfirm>
    }

  if (inModal === true) {
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {getPopConfirmForDelete(transaction)}
        </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <EditTransaction transaction={transaction} mode='div' />
      <MoveProjectItem
        type={ProjectType.LEDGER}
        projectItemId={transaction.id}
        mode='div'
      />
      <ShareProjectItem
        type={ProjectType.LEDGER}
        projectItemId={transaction.id}
        mode="div"
      />
      {getPopConfirmForDelete(transaction)}
    </div>
  );
};

const TransactionItem: React.FC<TransactionProps & TransactionManageProps> = (props) => {
  const { transaction, theme, deleteTransaction, inModal, inProject, showModal, type, setSelectedLabel, updateTransactionColorSettingShown } = props;
  // hook history in router
  const history = useHistory();
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    setSelectedLabel(label);
    history.push('/labels/search');
  };

  const getPaymentDateTime = () => {
    if (!transaction.date) {
        if (transaction.recurrenceRule) {
            const s = convertToTextWithRRule(transaction.recurrenceRule);
            return <Tooltip
                title={s}
                placement={'bottom'}
            >
                <div className="project-item-time">
                    <Tag className="item-tag">{s}</Tag>
                </div>
            </Tooltip>
        }

      return null;
    }

    return (
      <Tooltip
        title={moment
          .tz(
            `${transaction.date} ${
              transaction.time ? transaction.time : '00:00'
            }`,
            transaction.timezone
          )
          .fromNow()}
        placement={'bottom'}
      >
        <div className='project-item-time'>
          {transaction.date} {transaction.time}
        </div>
      </Tooltip>
    );
  };

  const getTransactionInfo = (transaction: Transaction) => {
    const amount = `${transaction.amount} ${
      props.currency ? LocaleCurrency.getCurrency(props.currency) : ''
    }`;
    switch (transaction.transactionType) {
      case 0:
        return (
          <Tooltip title={`Income ${amount}`}>
            <span className='transaction-item-income'>
              <DollarOutlined /> {transaction.amount}
            </span>
          </Tooltip>
        );
      case 1:
        return (
          <Tooltip title={`Expense ${amount}`}>
            <span className='transaction-item-expense'>
              <DollarOutlined /> {transaction.amount}
            </span>
          </Tooltip>
        );
    }

    return null;
  };

  const getAvatar = (user: User) => {
    if (!inProject || !showModal) {
        return <span
            className='user-avatar-icon'><Avatar src={user.avatar} size='small' /></span>;
    }
    return (
        <span
            className='user-avatar-icon'
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              showModal(user);
            }}
        >
        <Avatar src={user.avatar} size='small' style={{ cursor: 'pointer' }} />
      </span>
    );
  };

    const getProjectItemContentDiv = () => {
        return <div className='project-item-content'>
            <Link to={`/transaction/${transaction.id}`}>
                <h3 className='project-item-name'>
                    <Tooltip
                        title={`Created by ${transaction.owner.alias}`}
                    >
                        {getAvatar(transaction.owner)}
                    </Tooltip>
                    {' '}{getItemIcon(transaction, <CreditCardOutlined/>)}&nbsp;
                    {transaction.name}
                </h3>
            </Link>
            <div className='project-item-subs'>
                <div className='project-item-labels'>
                    {transaction.labels &&
                    transaction.labels.map((label) => {
                        return (
                            <Tag
                                key={`label${label.id}`}
                                className='labels'
                                onClick={() => toLabelSearching(label)}
                                color={stringToRGB(label.value)}
                                style={{cursor: 'pointer', borderRadius: 10}}
                            >
                                        <span>
                                          {getIcon(label.icon)} &nbsp;
                                            {label.value}
                                        </span>
                            </Tag>
                        );
                    })}
                </div>
                {getPaymentDateTime()}
            </div>
        </div>;
    }

    const handleClickChangeBgColor = (noteId: number) => {
      history.push(`/transaction/${noteId}`);
      updateTransactionColorSettingShown(true);
    }

    const getProjectItemContentWithMenu = () => {
        if (inModal === true) {
            return getProjectItemContentDiv()
        }

        return <>
            <MenuProvider id={`transaction${transaction.id}`}>
                {getProjectItemContentDiv()}
            </MenuProvider>

            <Menu id={`transaction${transaction.id}`} style={{background:bgColor}}
                  theme={theme === 'DARK' ? ContextMenuTheme.dark : ContextMenuTheme.light}
                  animation={animation.zoom}>
                <CopyToClipboard
                    text={`${transaction.name} ${window.location.origin.toString()}/#/transaction/${transaction.id}`}
                    onCopy={() => message.success('Link Copied to Clipboard')}
                >
                    <Item>
                        <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><CopyOutlined/></IconFont>
                        <span>Copy Link Address</span>
                    </Item>
                </CopyToClipboard>
                <Item onClick={() => handleClickChangeBgColor(transaction.id)}>
                    <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><BgColorsOutlined/></IconFont>
                    <span>Set Background Color</span>
                </Item>
            </Menu>
        </>;
    }

    const bgColorSetting = transaction.color ? JSON.parse(transaction.color) : undefined;
    const bgColor = bgColorSetting ? `rgba(${ bgColorSetting.r }, ${ bgColorSetting.g }, ${ bgColorSetting.b }, ${ bgColorSetting.a })` : undefined;

    return (
        <div className='project-item' style={{background: bgColor}}>
            {getProjectItemContentWithMenu()}
            <div className='project-control'>
                <div className='project-item-owner'>
                    <Tooltip
                        title={`Payer ${transaction.payer.alias}`}
                    >
                        {getAvatar(transaction.payer)}
                    </Tooltip>
                </div>
                <div className='project-item-owner'>
                    {getTransactionInfo(transaction)}
                </div>
                <Popover
                    arrowPointAtCenter
                    placement='rightTop'
                    overlayStyle={{width: '150px'}}
                    content={
                        <ManageTransaction
                            transaction={transaction}
                            type={type}
                            deleteTransaction={deleteTransaction}
                            inModal={inModal}
                        />
                    }
                    trigger='click'
                >
                          <span className='project-control-more'>
                            <MoreOutlined/>
                          </span>
                </Popover>
            </div>
        </div>
  );
};

const mapStateToProps = (state: IState) => ({
  currency: state.myself.currency,
  theme: state.myself.theme,
});

export default connect(mapStateToProps, {
  deleteTransaction,
  setSelectedLabel,
  updateTransactionColorSettingShown,
})(TransactionItem);
