import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pay {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @CreateDateColumn()
    date: Date;

    @Column()
    origin: string;

}
