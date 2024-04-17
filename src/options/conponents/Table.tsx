import React, { useEffect, useState, useRef } from 'react';
import { Space, Table, Modal, message } from 'antd';
import { Button, Box, Input } from '@chakra-ui/react'

const KeysTable: React.FC = () => {


    const keywordRef = useRef<HTMLInputElement>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        await insert()
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [data, setData] = useState([])
    const [fresh, setFresh] = useState(false)

    const insert = async () => {
        if (keywordRef.current?.value.trim()) {
            await chrome.runtime.sendMessage({ type: "add", data: keywordRef.current?.value.trim() })
            setFresh(!fresh)
        } else {
            message.error("未输入关键字")
        }

    }

    const deleteData = async (item) => {
        await chrome.runtime.sendMessage({ type: "delete", data: item })
        setFresh(!fresh)
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
        chrome.runtime.sendMessage(extensionId, { type: "list" }, (resp) => {
            console.log("resp==>", resp);
            setData(resp.data)
        })

    }, [fresh])
    return (
        <>
            <Box m={"auto"} mt={"50px"}>
                <Button border={"1px solid black"} ml="0" variant={"whiteBase"} onClick={showModal}>新增</Button>
                <Table columns={columns} dataSource={data} />
                <Modal title="关键字" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="创建" cancelText="取消">
                    <Input placeholder='请输入关键字' ref={keywordRef} />
                </Modal>
            </Box>

        </>
    )
};

export default KeysTable;