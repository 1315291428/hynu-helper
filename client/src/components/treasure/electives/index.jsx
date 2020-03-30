import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtIcon, AtProgress, AtModal } from 'taro-ui'
import ajax from '@utils/ajax'
import './index.scss'

export default class Index extends Component {
  static defaultProps = {
    list: [],
    selectList: () => {},
    showBottom: () => {}
  }

  state = {
    modal: false,
    success: {}
  }

  select = (id, item, e) => {
    e.stopPropagation()
    if (item.surplus == 0) {
      Taro.showToast({
        title: '选课人数已满！',
        icon: 'none'
      })
    } else if (this.props.selected) {
      Taro.showToast({
        title: '本学期已选了一门选修课，无法再选！',
        icon: 'none'
      })
    } else {
      const sessionid = Taro.getStorageSync('sid')
      const data = {
        func: 'easyQuery',
        data: {
          sessionid,
          queryDetail: id,
          spider: 'checkCancelxxk'
        }
      }
      ajax('base', data).then(res => {
        let notoast
        if (res.msg.includes('选课成功')) {
          notoast = true
          this.setState({ modal: true, success: item })
        }
        Taro.pageScrollTo({
          scrollTop: 0
        })
        this.props.selectList(notoast)
      })
    }
  }

  handleClose = () => this.setState({ modal: false })

  render() {
    const { list, showBottom } = this.props
    const { modal, success } = this.state

    return (
      <View>
        {list.length &&
          list.map((item, i) => (
            <View
              className='border-b'
              onClick={showBottom.bind(this, item, i)}
              key={item.name}
            >
              <View className='item-container at-row'>
                <View className='at-col at-col-8'>
                  <View className='item'>{item.name}</View>
                  <View>
                    <View className='more'>开课院系：{item.from}</View>
                    {item.teacher && (
                      <View className='more'>授课教师：{item.teacher}</View>
                    )}
                  </View>
                </View>
                <View className='at-col at-col-3'>
                  {item.mySelected ? (
                    <Button
                      className='btn cancel'
                      onClick={this.select.bind(e, item.classID, item)}
                    >
                      退选
                    </Button>
                  ) : (
                    <Button
                      className='btn'
                      onClick={this.select.bind(e, item.classID, item)}
                    >
                      {item.surplus == 0 ? '已满' : '选课'}
                    </Button>
                  )}
                </View>
              </View>
              {item.progress >= 0 && (
                <View className='pro-txt'>
                  已选/总人数：
                  <AtProgress
                    strokeWidth={9}
                    percent={item.progress}
                    color='#f2a379'
                  />
                </View>
              )}
              {(item.mySelected || item.bottomShow) && (
                <View className='bottom'>
                  {!item.mySelected && (
                    <View className='at-row'>
                      <View className='at-col'>已选：{item.selected}人</View>
                      <View className='at-col'>剩余：{item.surplus}人</View>
                    </View>
                  )}
                  <View className='at-row'>
                    <View className='at-col'>上课周：{item.week}周</View>
                    <View className='at-col'>上课时间：{item.time}</View>
                  </View>
                  {item.credit && <View>学分：{item.credit}</View>}
                  {item.place && <View>地点：{item.place}</View>}
                  {item.sex && <View>性别要求：{item.sex}</View>}
                </View>
              )}
              {!item.mySelected && (
                <View>
                  <AtIcon
                    value={item.bottomShow ? 'chevron-up' : 'chevron-down'}
                    size='22'
                    color='#666'
                  />
                  {item.bottomShow ? '收起' : '更多'}
                </View>
              )}
            </View>
          ))}
        <AtModal
          isOpened={modal}
          cancelText='好的'
          onClose={this.handleClose}
          onCancel={this.handleClose}
          content={`你已成功选中《${success.name}》，时间为${success.week}周 ${success.time}`}
        />
      </View>
    )
  }
}