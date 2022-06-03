export interface TurretFile {
    $schema: string;
    /**
     *  @min 0
     */
    range: number;
}

export default interface TurretOptions {
    range: number;
}
