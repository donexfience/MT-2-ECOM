import { Types } from 'mongoose';

type MailProductItem = {
  product_id: Types.ObjectId;
  quantity: number;
  price: number;
};

export default MailProductItem;