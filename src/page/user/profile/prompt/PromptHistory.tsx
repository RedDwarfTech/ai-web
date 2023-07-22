import withConnect from "@/page/component/hoc/withConnect";
import { Prompt, getPage } from "@/storage/indexdb/idb";
import { EntityList } from "rdjs-wheel";
import React, { useState } from "react";
import Table from 'rc-table';
import "@/scss/style.scss";

interface TableParams {
    pagination?: any;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, any>;
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
        fetchPrompts(tableParams.pagination);
    }, []);

    const fetchPrompts = async (pagination?: any) => {
        const promptPage:EntityList<Prompt> = await getPage<Prompt>(pagination);
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
        pagination: any,
        sorter: any,
    ) => {
        setTableParams({
            pagination,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
        fetchPrompts(pagination);
    };

    return (
        <div>
            <div title="本地提示词">
                <Table data={data}
                    className="table table-striped"
                    //pagination={tableParams.pagination}
                    rowKey={(record) => record.id}
                    //loading={loading}
                    //onChange={handleTableChange}
                    columns={columns}>
                </Table>
            </div>
        </div>
    );
}

export default withConnect(PromptHistory);