export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RuleFunction = (val?: string | number) => true | string;

export type RuleConfig = {
  required?: boolean;
  min?: number | string; // numeric string if the desired value type is a string, plain number if it is a number
  max?: number | string;
  email?: boolean;
  custom?: RuleFunction | RuleFunction[];
};

export function createRules(config: RuleConfig): RuleFunction[] {
  const rules: RuleFunction[] = [];

  if (config.required) {
    rules.push((val) => !!val || 'This field is required.');
  }

  // Handle 'min' validation (both number and string types)
  if (config.min) {
    rules.push((val) => {
      if (typeof config.min === 'string') {
        // If min is a string, compare its length
        return (
          (val && val.toString().length >= parseInt(config.min)) ||
          `Minimum ${config.min} characters.`
        );
      } else {
        const numVal = Number(val);
        // If min is a number, compare numerically
        return (
          (!isNaN(numVal) && numVal >= Number(config.min)) || `Minimum value is ${config.min}.`
        );
      }
    });
  }

  // Handle 'max' validation (both number and string types)
  if (config.max) {
    rules.push((val) => {
      if (typeof config.max === 'string') {
        // If max is a string, compare its length
        return (
          (val && val.toString().length <= parseInt(config.max)) ||
          `Maximum ${config.max} characters.`
        );
      } else {
        const numVal = Number(val);
        // If max is a number, compare numerically
        return (
          (!isNaN(numVal) && numVal <= Number(config.max)) || `Maximum value is ${config.max}.`
        );
      }
    });
  }

  if (config.email) {
    rules.push((val) => (val && emailRegex.test(val.toString())) || 'Invalid email format.');
  }

  // Handle custom validation
  if (config.custom) {
    if (Array.isArray(config.custom)) {
      rules.push(...config.custom);
    } else {
      rules.push(config.custom);
    }
  }

  return rules;
}
