import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pay {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    message: string;

    @CreateDateColumn()
    date: Date;

    @Column()
    origin: string;

}
