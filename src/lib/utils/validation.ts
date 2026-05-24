export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidBrazilPhone(value: string): boolean {
  if (!value.trim()) {
    return true;
  }
  const len = digitsOnly(value).length;
  return len === 10 || len === 11;
}

export function isValidCpf(value: string): boolean {
  if (!value.trim()) {
    return true;
  }
  return digitsOnly(value).length === 11;
}

export function phoneValidationMessage(value: string): string | undefined {
  if (!value.trim()) {
    return undefined;
  }
  if (!isValidBrazilPhone(value)) {
    return "Telefone inválido. Use DDD + número (10 ou 11 dígitos).";
  }
  return undefined;
}

export function cpfValidationMessage(value: string): string | undefined {
  if (!value.trim()) {
    return undefined;
  }
  if (!isValidCpf(value)) {
    return "CPF deve ter 11 dígitos.";
  }
  return undefined;
}
