import { useCryptoContext } from '../context/crypto-context';
import { Table } from 'antd';
const columns = [
  {
    title: 'Название',
    dataIndex: 'name',
    showSorterTooltip: { target: 'full-header' },
  },
  {
    title: 'Цена, $',
    dataIndex: 'price',
  },
  {
    title: 'Количество',
    dataIndex: 'amount',
  },
];

export default function AssetsTable() {

  const {assets} = useCryptoContext ()

  const data = assets.map(a => ({
    key: a.id,
    name: a.name,
    price: a.price,
    amount: a.amount,
  }))

    return <Table
    pagination={false}
    columns={columns}
    dataSource={data}
  />;
  } 