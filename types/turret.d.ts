export interface TurretFile {
    $schema: string;
    /**
     * The range of the turret.
     * @minimum 0
     */
    range: number;
}

export default interface TurretOptions {
    range: number;
}
