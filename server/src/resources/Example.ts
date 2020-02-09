class Example {

    public value: string;

    constructor(value: string) {
        this.value = value;
    }

    log(): string {
        return this.value;
    }
}

export { Example };