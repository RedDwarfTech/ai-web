import withConnect from "@/page/component/hoc/withConnect";
import { Prompt, getPage } from "@/storage/indexdb/idb";
import { Card, Table, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { REST } from "js-wheel";
import React, { useState } from "react";

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
}

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '提示词',
        dataIndex: 'name',
        key: 'name',
    }
];

const PromptHistory: React.FC = (props: any) => {
    const [data, setData] = useState<Prompt[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10
        },
    });

    React.useEffect(() => {
        fetchPrompts();
    }, []);


    const fetchPrompts = async () => {
        const promptPage:REST.EntityList<Prompt> = await getPage<Prompt>(tableParams.pagination);
        setData(promptPage.data);
        setTableParams({
            pagination: {
                current: promptPage.pagination.page,
                pageSize: promptPage.pagination.per_page,
                total: promptPage.pagination.total
            }
        });
    }

    const handleTableChange = (
        pagination: TablePaginationConfig,
        sorter: SorterResult<Prompt>,
    ) => {
        setTableParams({
            pagination,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <div>
            <Card title="本地提示词">
                <Table dataSource={data}
                    pagination={tableParams.pagination}
                    rowKey={(record) => record.id}
                    loading={loading}
                    onChange={handleTableChange}
                    columns={columns}>
                </Table>
            </Card>
        </div>
    );
}

export default withConnect(PromptHistory);