import { RowDataPacket } from "mysql2";

type ExecuteResult<T extends RowDataPacket & object> = RowDataPacket & T