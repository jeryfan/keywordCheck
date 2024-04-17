import React, { useEffect, useState, useRef } from 'react';
import { Space, Table, Modal, message, Upload } from 'antd';
import { Button, Box, Input, IconButton, Flex } from '@chakra-ui/react'
import { UploadOutlined } from '@ant-design/icons'
import { exportXlsx, xlsxRead } from '../utils';


const KeysTable: React.FC = () => {


    const keywordRef = useRef<HTMLInputElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            await insert()
            message.success("创建成功")
        } catch (e) {
            console.log(e);
            message.error("创建失败")

        }
        setIsModalOpen(false)
        setTimeout(() => { setFresh(() => !fresh); keywordRef.current.value = "" }, 500)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        keywordRef.current.value = ""
    };

    const [data, setData] = useState([])
    const [fresh, setFresh] = useState(false)

    const insert = async () => {
        if (keywordRef.current?.value.trim()) {
            await chrome.runtime.sendMessage({ type: "add", data: { name: keywordRef.current?.value.trim() } })
        } else {
            message.error("未输入关键字")
        }
    }

    const deleteData = async (item) => {
        await chrome.runtime.sendMessage({ type: "delete", data: item })
        setTimeout(() => { setFresh(() => !fresh) }, 500)
    }

    const columns = [
        {
            title: '关键字',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '删除',
            key: 'delete',
            render: (_, record) => (
                <Space size="middle">
                    <a color='red' onClick={async () => {
                        await deleteData(record)

                    }}>删除</a>
                </Space>
            ),
        },
    ];


    useEffect(() => {
        const extensionId = chrome.runtime.id
        chrome.runtime.sendMessage(extensionId, { type: "list" }, (keywords) => {
            console.log("resp==>", keywords);
            setTimeout(() => {
                setData(keywords)
            }, 1000)
        })

    }, [fresh])

    const customRequest = async (x) => {
        const { data } = await xlsxRead(x.file)
        console.log(data);

        if (data) {
            await chrome.runtime.sendMessage({ type: "bulkAdd", data: data.map(item => ({ name: item["name"] })) })
            setTimeout(() => { setFresh(() => !fresh) }, 500)
        }

    }

    const exportExcel = async () => {
        const extensionId = chrome.runtime.id
        chrome.runtime.sendMessage(extensionId, { type: "list" }, (keywords) => {
            const exportData = keywords.map(item => ({ name: item["name"] }))
            exportXlsx(exportData)
        })
    }


    return (
        <>
            <Box m={"auto"} mt={"50px"}>
                <Flex>
                    <Button mb="3px" mr={"2px"} border={"1px solid black"} ml="0" variant={"whiteBase"} onClick={showModal}>新增</Button>
                    <Upload customRequest={customRequest} showUploadList={false}>
                        <IconButton aria-label="导入" icon={<UploadOutlined />} mb="3px" mr={"2px"} border={"1px solid black"} ml="0" variant={"whiteBase"} />
                    </Upload>
                    <Button mb="3px" border={"1px solid black"} ml="0" variant={"whiteBase"} onClick={exportExcel}>导出</Button>
                </Flex>
                <Table columns={columns} dataSource={data} />
                <Modal title="关键字" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="创建" cancelText="取消">
                    <Input placeholder='请输入关键字' ref={keywordRef} onKeyDown={async (event) => {
                        if (event.keyCode === 13) {
                            await handleOk()
                        }
                    }} />
                </Modal>
            </Box>

        </>
    )
};

export default KeysTable;