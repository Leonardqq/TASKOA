import React from 'react';
import './App.less';
import { connect } from 'react-redux';
import actions from './store/actions/index';
import api from './api/index';

import { PageHeader, Button, Tag, Table, Modal, message, Input, DatePicker } from 'antd';
const { confirm } = Modal;
const { TextArea } = Input;

class App extends React.Component {
	state = {
		columns: [{
			title: '编号',
			dataIndex: 'id',
			width: '12%',
			defaultSortOrder: 'ascend',
			sorter: (a, b) => a.id - b.id
		}, {
			title: '任务描述',
			dataIndex: 'task',
			width: '40%'
		}, {
			title: '状态',
			render: text => parseInt(text.state) === 1 ? '未完成' : '已完成',
			width: '13%'
		}, {
			title: '预计完成时间',
			render: text => this.formatTime(text),
			width: '20%'
		}, {
			title: '操作',
			width: '15%',
			render: text => {
				return <>
					<a onClick={() => this.handleDelete(text)}>删除</a>
					&nbsp;&nbsp;
					{parseInt(text.state) === 1 ? <a onClick={ev => this.handleComplete(text)}>完成</a> : null}
				</>;
			}
		}],
		// 控制模态框和表单内容
		visible: false,
		task: '',
		time: '',
		// 控制标签选中
		activeIndex: 0
	};
	// 处理日期的函数
	addZero = val => {
		val = parseInt(val);
		if (!val) {
			return '00';
		}
		return val < 10 ? '0' + val : val;
	};
	formatTime = text => {
		let time = parseInt(text.state) === 1 ? text.time : text.complete;
		time = time.match(/\d+/g);
		return `${this.addZero(time[1])}-${this.addZero(time[2])} ${this.addZero(time[3])}:${this.addZero(time[4])}`;
	};
	handleComplete = text => {
		confirm({
			title: '系统温馨提示',
			content: `您确定要将编号为${text.id}的任务设置为已完成吗？`,
			onOk: async () => {
				let data = await api.task.completeTask(text.id);
				if (data.code === 0) {
					message.success('设置完成！');
					this.props.queryAll();
					return;
				}
				message.error('非常抱歉，设置失败了，请稍后重试...')
			}
		})
	}
	handleDelete = text => {
		confirm({
			title: '系统温馨提示',
			content: `您确定要将编号为${text.id}的任务删除吗？`,
			onOk: async () => {
				let data = await api.task.removeTask(text.id);
				if (parseInt(data.code) === 0) {
					message.success('删除完成！');
					this.props.queryAll();
					return;
				}
				message.error('非常抱歉，删除失败了，请稍后重试...')
			}
		})
	}
	handleOK = async () => {
		let { task, time } = this.state;
		let data = await api.task.addTask(task, time);
		if (parseInt(data.code) === 0) {
			message.success('恭喜您，添加成功啦~~');
			this.handleCancel();
			this.props.queryAll();
			return;
		}
		message.error('很遗憾，添加失败了...')
	};
	handleCancel = () => {
		this.setState({
			visible: false,
			task: ''
		});
	};
	openModal = () => {
		this.setState({
			visible: true
		});
	};
	// 渲染
	render() {
		let { columns, visible, task, activeIndex } = this.state;
		let { taskList } = this.props;
		return <div className="container">
			<PageHeader title="任务管理系统">
				<Button type='dashed'
					onClick={this.openModal}>
					新增任务
				</Button>
			</PageHeader>
			<div className="navBox">
				{['全部', '未完成', '已完成'].map((item, index) => {
					return <Tag key={index}
						color={activeIndex === index ? 'blue' : ''}
						onClick={this.handleTag.bind(this, index)}>
						{item}
					</Tag>;
				})}
			</div>
			<Table columns={columns} dataSource={this.filterData(taskList)} pagination={false} rowKey="id" />

			{/* 新增任务 */}
			<Modal title="新增任务"
				visible={visible}
				onOk={this.handleOK}
				onCancel={this.handleCancel}>
				<p>任务描述：</p>
				<TextArea rows={3} value={task} onChange={ev => {
					this.setState({ task: ev.target.value });
				}} />
				<p>预计完成时间：</p>
				<DatePicker format="YYYY-MM-DD HH:mm:ss"
					onChange={(str) => {
						this.setState({ time: str });
					}} />
			</Modal>
		</div>;
	}
	// 点击TAG
	filterData = taskList => {
		if (!this.props.taskList) {
			this.props.queryAll();
			return [];
		}
		let activeIndex = this.state.activeIndex;
		if (activeIndex === 0) return taskList;
		return taskList.filter(item => {
			return parseInt(item.state) === activeIndex;
		});
	};
	handleTag = index => {
		this.setState({ activeIndex: index });
	};
	componentWillMount() {
		if (!this.props.taskList) {
			this.props.queryAll();
		}
	}
}
export default connect(state => state.task, actions.task)(App);