/**
 * Sistema de Internacionalização (i18n) para @ninots/validation.
 *
 * @packageDocumentation
 * Fornece mensagens de erro traduzidas para múltiplos idiomas.
 * Suporta pt-BR, en e es.
 */

// ============================================
// Types
// ============================================

/**
 * Idiomas suportados.
 */
export type Locale = 'pt-BR' | 'en' | 'es';

/**
 * Mapa de mensagens de validação.
 * Cada chave é um código de erro e o valor é o template da mensagem.
 * Templates podem conter placeholders como :field, :min, :max, etc.
 */
export interface ValidationMessages {
  required: string;
  not_nullable: string;
  invalid_type: string;
  email: string;
  uuid: string;
  url: string;
  min_length: string;
  max_length: string;
  min_value: string;
  max_value: string;
  positive: string;
  negative: string;
  integer: string;
  multiple_of: string;
  range: string;
  equal: string;
  finite: string;
  safe_integer: string;
  alpha: string;
  alpha_empty: string;
  alpha_num: string;
  alpha_num_empty: string;
  alpha_dash: string;
  alpha_dash_empty: string;
  active_url: string;
  digits: string;
  digits_between: string;
  ip: string;
  in: string;
  not_in: string;
  regex: string;
  starts_with: string;
  ends_with: string;
  contains: string;
  empty: string;
  non_empty: string;
  array: string;
  boolean: string;
  number: string;
  string: string;
  confirmed: string;
  same: string;
  different: string;
  before: string;
  after: string;
  before_or_equal: string;
  after_or_equal: string;
  date_equals: string;
  date_format: string;
  timezone: string;
  exists: string;
  unique: string;
  image: string;
  dimensions: string;
  mimes: string;
  mimetypes: string;
  password: string;
  required_if: string;
  required_unless: string;
  required_with: string;
  required_without: string;
  prohibited_if: string;
  prohibited_unless: string;
  exclude_if: string;
  bail: string;
  missing: string;
  missing_if: string;
  missing_unless: string;
  missing_with: string;
  missing_with_all: string;
  distinct: string;
  list: string;
  required_array_keys: string;
  in_array: string;
  in_array_keys: string;
  filled: string;
  present: string;
  present_if: string;
  present_unless: string;
}

/**
 * Mapa de traduções por locale.
 */
export interface LocaleTranslations {
  [locale: string]: ValidationMessages;
}

// ============================================
// Traduções pt-BR
// ============================================

export const ptBR: ValidationMessages = {
  active_url: 'O campo :field deve ser uma URL ativa.',
  after: 'O campo :field deve ser uma data posterior a :date.',
  after_or_equal: 'O campo :field deve ser uma data posterior ou igual a :date.',
  alpha: 'O campo :field deve conter apenas letras.',
  alpha_dash: 'O campo :field deve conter apenas letras, números, traços e underscores.',
  alpha_dash_empty: 'O campo :field deve conter apenas letras, números, traços e underscores.',
  alpha_empty: 'O campo :field deve conter apenas letras.',
  alpha_num: 'O campo :field deve conter apenas letras e números.',
  alpha_num_empty: 'O campo :field deve conter apenas letras e números.',
  array: 'O campo :field deve ser um array.',
  bail: 'Pare a validação após o primeiro erro.',
  before: 'O campo :field deve ser uma data anterior a :date.',
  before_or_equal: 'O campo :field deve ser uma data anterior ou igual a :date.',
  boolean: 'O campo :field deve ser um booleano.',
  confirmed: 'A confirmação do campo :field não corresponde.',
  contains: 'O campo :field deve conter :value.',
  date_equals: 'O campo :field deve ser igual à data :date.',
  date_format: 'O campo :field deve estar no formato :format.',
  different: 'O campo :field deve ser diferente do campo :other.',
  digits: 'O campo :field deve ter exatamente :length dígitos.',
  digits_between: 'O campo :field deve ter entre :min e :max dígitos.',
  dimensions: 'O campo :field tem dimensões inválidas.',
  distinct: 'O campo :field tem valores duplicados.',
  email: 'O campo :field deve ser um email válido.',
  empty: 'O campo :field deve estar vazio.',
  ends_with: 'O campo :field deve terminar com :value.',
  equal: 'O campo :field deve ser igual a :value.',
  exclude_if: 'O campo :field deve ser excluído quando :other é :value.',
  exists: 'O campo :field selecionado não existe.',
  filled: 'O campo :field deve ter um valor.',
  finite: 'O campo :field deve ser um número finito.',
  image: 'O campo :field deve ser uma imagem.',
  in: 'O campo :field deve ser um dos valores permitidos.',
  in_array: 'O campo :field não existe em :other.',
  in_array_keys: 'O campo :field deve conter apenas chaves de :other.',
  integer: 'O campo :field deve ser um número inteiro.',
  invalid_type: 'O campo :field deve ser do tipo :type.',
  ip: 'O campo :field deve ser um endereço IP válido.',
  list: 'O campo :field deve ser uma lista.',
  max_length: 'O campo :field deve ter no máximo :max caracteres.',
  max_value: 'O campo :field deve ser no máximo :max.',
  mimes: 'O campo :field deve ser um arquivo do tipo: :values.',
  mimetypes: 'O campo :field deve ser um arquivo do tipo: :values.',
  min_length: 'O campo :field deve ter pelo menos :min caracteres.',
  min_value: 'O campo :field deve ser no mínimo :min.',
  missing: 'O campo :field deve estar ausente.',
  missing_if: 'O campo :field deve estar ausente quando :other é :value.',
  missing_unless: 'O campo :field deve estar ausente a menos que :other seja :value.',
  missing_with: 'O campo :field deve estar ausente quando :values está presente.',
  missing_with_all: 'O campo :field deve estar ausente quando :values estão presentes.',
  multiple_of: 'O campo :field deve ser múltiplo de :value.',
  negative: 'O campo :field deve ser negativo.',
  non_empty: 'O campo :field não pode estar vazio.',
  not_in: 'O campo :field não deve ser um dos valores proibidos.',
  not_nullable: 'O campo :field não pode ser nulo.',
  number: 'O campo :field deve ser um número.',
  password: 'A senha fornecida está incorreta.',
  positive: 'O campo :field deve ser positivo.',
  present: 'O campo :field deve estar presente.',
  present_if: 'O campo :field deve estar presente quando :other é :value.',
  present_unless: 'O campo :field deve estar presente a menos que :other seja :value.',
  prohibited_if: 'O campo :field é proibido quando :other é :value.',
  prohibited_unless: 'O campo :field é proibido a menos que :other seja :value.',
  range: 'O campo :field deve estar entre :min e :max.',
  regex: 'O campo :field não corresponde ao padrão esperado.',
  required: 'O campo :field é obrigatório.',
  required_array_keys: 'O campo :field deve conter as chaves: :values.',
  required_if: 'O campo :field é obrigatório quando :other é :value.',
  required_unless: 'O campo :field é obrigatório a menos que :other seja :value.',
  required_with: 'O campo :field é obrigatório quando :values está presente.',
  required_without: 'O campo :field é obrigatório quando :values não está presente.',
  safe_integer: 'O campo :field deve ser um safe integer.',
  same: 'O campo :field deve ser igual ao campo :other.',
  starts_with: 'O campo :field deve começar com :value.',
  string: 'O campo :field deve ser uma string.',
  timezone: 'O campo :field deve ser um fuso horário válido.',
  unique: 'O campo :field já está em uso.',
  url: 'O campo :field deve ser uma URL válida.',
  uuid: 'O campo :field deve ser um UUID válido.',
};

// ============================================
// Traduções en
// ============================================

export const en: ValidationMessages = {
  active_url: 'The :field field must be an active URL.',
  after: 'The :field field must be a date after :date.',
  after_or_equal: 'The :field field must be a date after or equal to :date.',
  alpha: 'The :field field may only contain letters.',
  alpha_dash: 'The :field field may only contain letters, numbers, dashes, and underscores.',
  alpha_dash_empty: 'The :field field may only contain letters, numbers, dashes, and underscores.',
  alpha_empty: 'The :field field may only contain letters.',
  alpha_num: 'The :field field may only contain letters and numbers.',
  alpha_num_empty: 'The :field field may only contain letters and numbers.',
  array: 'The :field field must be an array.',
  bail: 'Stop validation after the first error.',
  before: 'The :field field must be a date before :date.',
  before_or_equal: 'The :field field must be a date before or equal to :date.',
  boolean: 'The :field field must be a boolean.',
  confirmed: 'The :field confirmation does not match.',
  contains: 'The :field field must contain :value.',
  date_equals: 'The :field field must be equal to :date.',
  date_format: 'The :field field must be in the format :format.',
  different: 'The :field field must be different from :other.',
  digits: 'The :field field must be exactly :length digits.',
  digits_between: 'The :field field must be between :min and :max digits.',
  dimensions: 'The :field field has invalid dimensions.',
  distinct: 'The :field field has duplicate values.',
  email: 'The :field field must be a valid email address.',
  empty: 'The :field field must be empty.',
  ends_with: 'The :field field must end with :value.',
  equal: 'The :field field must be equal to :value.',
  exclude_if: 'The :field field should be excluded when :other is :value.',
  exists: 'The selected :field does not exist.',
  filled: 'The :field field must have a value.',
  finite: 'The :field field must be a finite number.',
  image: 'The :field field must be an image.',
  in: 'The selected :field is invalid.',
  in_array: 'The :field field does not exist in :other.',
  in_array_keys: 'The :field field must contain only keys from :other.',
  integer: 'The :field field must be an integer.',
  invalid_type: 'The :field field must be of type :type.',
  ip: 'The :field field must be a valid IP address.',
  list: 'The :field field must be a list.',
  max_length: 'The :field field must be at most :max characters.',
  max_value: 'The :field field must be at most :max.',
  mimes: 'The :field field must be a file of type: :values.',
  mimetypes: 'The :field field must be a file of type: :values.',
  min_length: 'The :field field must be at least :min characters.',
  min_value: 'The :field field must be at least :min.',
  missing: 'The :field field must be missing.',
  missing_if: 'The :field field must be missing when :other is :value.',
  missing_unless: 'The :field field must be missing unless :other is :value.',
  missing_with: 'The :field field must be missing when :values is present.',
  missing_with_all: 'The :field field must be missing when :values are present.',
  multiple_of: 'The :field field must be a multiple of :value.',
  negative: 'The :field field must be negative.',
  non_empty: 'The :field field cannot be empty.',
  not_in: 'The selected :field is forbidden.',
  not_nullable: 'The :field field cannot be null.',
  number: 'The :field field must be a number.',
  password: 'The provided password is incorrect.',
  positive: 'The :field field must be positive.',
  present: 'The :field field must be present.',
  present_if: 'The :field field must be present when :other is :value.',
  present_unless: 'The :field field must be present unless :other is :value.',
  prohibited_if: 'The :field field is prohibited when :other is :value.',
  prohibited_unless: 'The :field field is prohibited unless :other is :value.',
  range: 'The :field field must be between :min and :max.',
  regex: 'The :field field format is invalid.',
  required: 'The :field field is required.',
  required_array_keys: 'The :field field must contain keys: :values.',
  required_if: 'The :field field is required when :other is :value.',
  required_unless: 'The :field field is required unless :other is :value.',
  required_with: 'The :field field is required when :values is present.',
  required_without: 'The :field field is required when :values is not present.',
  safe_integer: 'The :field field must be a safe integer.',
  same: 'The :field field must match :other.',
  starts_with: 'The :field field must start with :value.',
  string: 'The :field field must be a string.',
  timezone: 'The :field field must be a valid timezone.',
  unique: 'The :field field has already been taken.',
  url: 'The :field field must be a valid URL.',
  uuid: 'The :field field must be a valid UUID.',
};

// ============================================
// Traduções es
// ============================================

export const es: ValidationMessages = {
  active_url: 'El campo :field debe ser una URL activa.',
  after: 'El campo :field debe ser una fecha posterior a :date.',
  after_or_equal: 'El campo :field debe ser una fecha posterior o igual a :date.',
  alpha: 'El campo :field solo puede contener letras.',
  alpha_dash: 'El campo :field solo puede contener letras, números, guiones y guiones bajos.',
  alpha_dash_empty: 'El campo :field solo puede contener letras, números, guiones y guiones bajos.',
  alpha_empty: 'El campo :field solo puede contener letras.',
  alpha_num: 'El campo :field solo puede contener letras y números.',
  alpha_num_empty: 'El campo :field solo puede contener letras y números.',
  array: 'El campo :field debe ser un array.',
  bail: 'Detener la validación después del primer error.',
  before: 'El campo :field debe ser una fecha anterior a :date.',
  before_or_equal: 'El campo :field debe ser una fecha anterior o igual a :date.',
  boolean: 'El campo :field debe ser un booleano.',
  confirmed: 'La confirmación del campo :field no coincide.',
  contains: 'El campo :field debe contener :value.',
  date_equals: 'El campo :field debe ser igual a :date.',
  date_format: 'El campo :field debe estar en el formato :format.',
  different: 'El campo :field debe ser diferente de :other.',
  digits: 'El campo :field debe tener exactamente :length dígitos.',
  digits_between: 'El campo :field debe tener entre :min y :max dígitos.',
  dimensions: 'El campo :field tiene dimensiones inválidas.',
  distinct: 'El campo :field tiene valores duplicados.',
  email: 'El campo :field debe ser una dirección de email válida.',
  empty: 'El campo :field debe estar vacío.',
  ends_with: 'El campo :field debe terminar con :value.',
  equal: 'El campo :field debe ser igual a :value.',
  exclude_if: 'El campo :field debe ser excluido cuando :other es :value.',
  exists: 'El :field seleccionado no existe.',
  filled: 'El campo :field debe tener un valor.',
  finite: 'El campo :field debe ser un número finito.',
  image: 'El campo :field debe ser una imagen.',
  in: 'El :field seleccionado no es válido.',
  in_array: 'El campo :field no existe en :other.',
  in_array_keys: 'El campo :field debe contener solo claves de :other.',
  integer: 'El campo :field debe ser un número entero.',
  invalid_type: 'El campo :field debe ser de tipo :type.',
  ip: 'El campo :field debe ser una dirección IP válida.',
  list: 'El campo :field debe ser una lista.',
  max_length: 'El campo :field debe tener como máximo :max caracteres.',
  max_value: 'El campo :field debe ser como máximo :max.',
  mimes: 'El campo :field debe ser un archivo de tipo: :values.',
  mimetypes: 'El campo :field debe ser un archivo de tipo: :values.',
  min_length: 'El campo :field debe tener al menos :min caracteres.',
  min_value: 'El campo :field debe ser al menos :min.',
  missing: 'El campo :field debe estar ausente.',
  missing_if: 'El campo :field debe estar ausente cuando :other es :value.',
  missing_unless: 'El campo :field debe estar ausente a menos que :other sea :value.',
  missing_with: 'El campo :field debe estar ausente cuando :values está presente.',
  missing_with_all: 'El campo :field debe estar ausente cuando :values están presentes.',
  multiple_of: 'El campo :field debe ser múltiplo de :value.',
  negative: 'El campo :field debe ser negativo.',
  non_empty: 'El campo :field no puede estar vacío.',
  not_in: 'El :field seleccionado está prohibido.',
  not_nullable: 'El campo :field no puede ser nulo.',
  number: 'El campo :field debe ser un número.',
  password: 'La contraseña proporcionada es incorrecta.',
  positive: 'El campo :field debe ser positivo.',
  present: 'El campo :field debe estar presente.',
  present_if: 'El campo :field debe estar presente cuando :other es :value.',
  present_unless: 'El campo :field debe estar presente a menos que :other sea :value.',
  prohibited_if: 'El campo :field está prohibido cuando :other es :value.',
  prohibited_unless: 'El campo :field está prohibido a menos que :other sea :value.',
  range: 'El campo :field debe estar entre :min y :max.',
  regex: 'El formato del campo :field no es válido.',
  required: 'El campo :field es obligatorio.',
  required_array_keys: 'El campo :field debe contener las claves: :values.',
  required_if: 'El campo :field es obligatorio cuando :other es :value.',
  required_unless: 'El campo :field es obligatorio a menos que :other sea :value.',
  required_with: 'El campo :field es obligatorio cuando :values está presente.',
  required_without: 'El campo :field es obligatorio cuando :values no está presente.',
  safe_integer: 'El campo :field debe ser un safe integer.',
  same: 'El campo :field debe coincidir con :other.',
  starts_with: 'El campo :field debe comenzar con :value.',
  string: 'El campo :field debe ser una cadena de texto.',
  timezone: 'El campo :field debe ser una zona horaria válida.',
  unique: 'El campo :field ya ha sido tomado.',
  url: 'El campo :field debe ser una URL válida.',
  uuid: 'El campo :field debe ser un UUID válido.',
};

// ============================================
// Locale Registry
// ============================================

/**
 * Registro de todas as traduções disponíveis.
 */
export const locales: LocaleTranslations = {
  en: en,
  es: es,
  'pt-BR': ptBR,
};

/**
 * Locale padrão.
 */
export const defaultLocale: Locale = 'pt-BR';
