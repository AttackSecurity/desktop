export namespace passwordAnalysis {
	
	export class Result {
	    TotalPasswords: number;
	    UniquePasswords: number;
	    AveragePasswordLength: number;
	    MinimumPasswordLength: number;
	    MaximumPasswordLength: number;
	    LowercasePercentage: number;
	    MostUsedLowercase: string;
	    UppercasePercentage: number;
	    MostUsedUppercase: string;
	    DigitsPercentage: number;
	    MostUsedDigit: string;
	    TotalSymbols: number;
	    MostUsedSymbol: string;
	    Top3MostUsedChars: string[];
	    RegexPattern: string;
	    Error: any;
	    Success: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.TotalPasswords = source["TotalPasswords"];
	        this.UniquePasswords = source["UniquePasswords"];
	        this.AveragePasswordLength = source["AveragePasswordLength"];
	        this.MinimumPasswordLength = source["MinimumPasswordLength"];
	        this.MaximumPasswordLength = source["MaximumPasswordLength"];
	        this.LowercasePercentage = source["LowercasePercentage"];
	        this.MostUsedLowercase = source["MostUsedLowercase"];
	        this.UppercasePercentage = source["UppercasePercentage"];
	        this.MostUsedUppercase = source["MostUsedUppercase"];
	        this.DigitsPercentage = source["DigitsPercentage"];
	        this.MostUsedDigit = source["MostUsedDigit"];
	        this.TotalSymbols = source["TotalSymbols"];
	        this.MostUsedSymbol = source["MostUsedSymbol"];
	        this.Top3MostUsedChars = source["Top3MostUsedChars"];
	        this.RegexPattern = source["RegexPattern"];
	        this.Error = source["Error"];
	        this.Success = source["Success"];
	    }
	}

}

export namespace passwordModifier {
	
	export class Output {
	    Modified: number;
	    Failed: number;
	    Lines: number;
	    Error: any;
	    Success: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Output(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Modified = source["Modified"];
	        this.Failed = source["Failed"];
	        this.Lines = source["Lines"];
	        this.Error = source["Error"];
	        this.Success = source["Success"];
	    }
	}

}

export namespace passwordValidator {
	
	export class Output {
	    Passed: number;
	    Failed: number;
	    Lines: number;
	    Error: any;
	    Success: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Output(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Passed = source["Passed"];
	        this.Failed = source["Failed"];
	        this.Lines = source["Lines"];
	        this.Error = source["Error"];
	        this.Success = source["Success"];
	    }
	}

}

export namespace utilities {
	
	export class Settings {
	    formatNumbers: boolean;
	    lineFormat: string;
	    maxWorkers: number;
	    hardwareAcceleration: boolean;
	    alwaysOnTop: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.formatNumbers = source["formatNumbers"];
	        this.lineFormat = source["lineFormat"];
	        this.maxWorkers = source["maxWorkers"];
	        this.hardwareAcceleration = source["hardwareAcceleration"];
	        this.alwaysOnTop = source["alwaysOnTop"];
	    }
	}

}

