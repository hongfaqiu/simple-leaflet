import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, message, Row } from 'antd'
import { Moment } from 'moment'
import { useState } from 'react';
import { fetchGeoJSON } from '../../service/map';
import { MapObj } from '../../Utils/Map';
import RectDrawer from './RectDrawer';

import './SearchPanel.css'

const { RangePicker } = DatePicker;

type QueryParams = {
  url: string
  dateRange?: [Moment, Moment]
  minx?: number
  maxx?: number
  miny?: number
  maxy?: number
}

const SearchPanel = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const switchPanel = (val: boolean) => {
    
  }

  const onFinish = async (values: QueryParams) => {
    const { url, dateRange, minx, miny, maxx, maxy } = values;
    const params = {
      url,
      extend: {
        minx, miny, maxx, maxy
      },
      startTime: dateRange?.[0].format('YYYY-MM-DD'),
      endTime: dateRange?.[1].format('YYYY-MM-DD'),
    }
    setLoading(true)
    console.log(params);
    try {
      const geojson = await fetchGeoJSON(url)
      MapObj?.removeAllLayers()
      MapObj?.addGeoJson(geojson)
      message.success('添加图层成功')
      setLoading(false)
    } catch {
      message.success('添加图层失败')
      setLoading(false)
    }
    
  }

  const reset = () => {
    MapObj?.removeAllLayers()
    form.resetFields()
  }

  const extendOptions = [
    {
      label: 'maxY',
      key: 'maxy',
      range: [-90, 90],
      colLayout: { span: 12, offset: 6 }
    },
    {
      label: 'minX',
      key: 'minx',
      range: [-180, 180],
      colLayout: { span: 12 }
    },
    {
      label: 'maxX',
      key: 'maxx',
      range: [-180, 180],
      colLayout: { span: 12 }
    },
    {
      label: 'minY',
      key: 'miny',
      range: [-90, 90],
      colLayout: { span: 12, offset: 6 }
    },
  ]

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  return (
    <div className="searchPanel">
      <div className="header">
        <div className="title">添加数据</div>
        <Button
          key="close"
          className='close-btn'
          icon={<CloseOutlined />}
          type="link"
          onClick={() => switchPanel(false)}
          title="关闭"
        />
      </div>
      <div className="form-containter">
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={onFinish}
        >

          <Form.Item label="GeoJSON url" name='url' rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="DatePicker" name='dateRange'>
            <RangePicker />
          </Form.Item>

          <Divider />

          {/* 四至 */}
          <Row >
            <div className="drawer">
              <RectDrawer
                onChange={val => {
                  form.setFieldsValue(val)
                }}
              />
            </div>
            {
              extendOptions.map(item => (
                <Col {...item.colLayout} key={item.key} >
                  <Form.Item name={item.key} label={item.label} key={item.key} >
                    <InputNumber
                      size='small'
                      min={item.range[0]}
                      max={item.range[1]}
                      precision={6}
                      style={{ width: '100%' }}
                      step={0.01}
                    />
                  </Form.Item>
                </Col>
              ))
            }
          </Row>
          
          <Form.Item {...tailLayout}>
            <Button className='submit' loading={loading} type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={reset}>
              重置
            </Button>
          </Form.Item>

        </Form>
      </div>
    </div>
  )
}

export default SearchPanel