import { Table } from 'antd';
const GenieAiTable = ({ columns, dataSource, pagination = false, rowData = () => { } }) => {

  return (
    <Table sticky={{ offsetHeader: 125}} dataSource={dataSource} columns={columns} pagination={pagination} bordered onRow={rowData}/>
  );
};

export default GenieAiTable;




