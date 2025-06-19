import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Index,
} from 'sequelize-typescript';

export interface UserMessageAttributes {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMessageCreationAttributes
  extends Omit<UserMessageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: 'user_messages',
  timestamps: true,
  underscored: true,
})
export class UserMessage extends Model<
  UserMessageAttributes,
  UserMessageCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  })
  name: string;

  @Index
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 5000],
    },
  })
  message: string;

  @Index
  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}
