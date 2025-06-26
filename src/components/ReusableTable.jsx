
import React from "react";
import { Table } from "antd";

const ReusableTable = ({ title, columns, data, loading }) => {
  return (
    <div className="p-6">
      {title && <h1 className="text-xl font-bold mb-4">{title}</h1>}
      <Table
        loading={loading}
        columns={columns}
        dataSource={data.map((item) => ({ ...item, key: item.id }))}
      />
    </div>
  );
};

export default ReusableTable;
