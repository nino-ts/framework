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
  required: 'O campo :field é obrigatório.',
  not_nullable: 'O campo :field não pode ser nulo.',
  invalid_type: 'O campo :field deve ser do tipo :type.',
  email: 'O campo :field deve ser um email válido.',
  uuid: 'O campo :field deve ser um UUID válido.',
  url: 'O campo :field deve ser uma URL válida.',
  min_length: 'O campo :field deve ter pelo menos :min caracteres.',
  max_length: 'O campo :field deve ter no máximo :max caracteres.',
  min_value: 'O campo :field deve ser no mínimo :min.',
  max_value: 'O campo :field deve ser no máximo :max.',
  positive: 'O campo :field deve ser positivo.',
  negative: 'O campo :field deve ser negativo.',
  integer: 'O campo :field deve ser um número inteiro.',
  multiple_of: 'O campo :field deve ser múltiplo de :value.',
  range: 'O campo :field deve estar entre :min e :max.',
  equal: 'O campo :field deve ser igual a :value.',
  finite: 'O campo :field deve ser um número finito.',
  safe_integer: 'O campo :field deve ser um safe integer.',
  alpha: 'O campo :field deve conter apenas letras.',
  alpha_empty: 'O campo :field deve conter apenas letras.',
  alpha_num: 'O campo :field deve conter apenas letras e números.',
  alpha_num_empty: 'O campo :field deve conter apenas letras e números.',
  alpha_dash: 'O campo :field deve conter apenas letras, números, traços e underscores.',
  alpha_dash_empty: 'O campo :field deve conter apenas letras, números, traços e underscores.',
  active_url: 'O campo :field deve ser uma URL ativa.',
  digits: 'O campo :field deve ter exatamente :length dígitos.',
  digits_between: 'O campo :field deve ter entre :min e :max dígitos.',
  ip: 'O campo :field deve ser um endereço IP válido.',
  in: 'O campo :field deve ser um dos valores permitidos.',
  not_in: 'O campo :field não deve ser um dos valores proibidos.',
  regex: 'O campo :field não corresponde ao padrão esperado.',
  starts_with: 'O campo :field deve começar com :value.',
  ends_with: 'O campo :field deve terminar com :value.',
  contains: 'O campo :field deve conter :value.',
  empty: 'O campo :field deve estar vazio.',
  non_empty: 'O campo :field não pode estar vazio.',
  array: 'O campo :field deve ser um array.',
  boolean: 'O campo :field deve ser um booleano.',
  number: 'O campo :field deve ser um número.',
  string: 'O campo :field deve ser uma string.',
  confirmed: 'A confirmação do campo :field não corresponde.',
  same: 'O campo :field deve ser igual ao campo :other.',
  different: 'O campo :field deve ser diferente do campo :other.',
  before: 'O campo :field deve ser uma data anterior a :date.',
  after: 'O campo :field deve ser uma data posterior a :date.',
  before_or_equal: 'O campo :field deve ser uma data anterior ou igual a :date.',
  after_or_equal: 'O campo :field deve ser uma data posterior ou igual a :date.',
  date_equals: 'O campo :field deve ser igual à data :date.',
  date_format: 'O campo :field deve estar no formato :format.',
  timezone: 'O campo :field deve ser um fuso horário válido.',
  exists: 'O campo :field selecionado não existe.',
  unique: 'O campo :field já está em uso.',
  image: 'O campo :field deve ser uma imagem.',
  dimensions: 'O campo :field tem dimensões inválidas.',
  mimes: 'O campo :field deve ser um arquivo do tipo: :values.',
  mimetypes: 'O campo :field deve ser um arquivo do tipo: :values.',
  password: 'A senha fornecida está incorreta.',
  required_if: 'O campo :field é obrigatório quando :other é :value.',
  required_unless: 'O campo :field é obrigatório a menos que :other seja :value.',
  required_with: 'O campo :field é obrigatório quando :values está presente.',
  required_without: 'O campo :field é obrigatório quando :values não está presente.',
  prohibited_if: 'O campo :field é proibido quando :other é :value.',
  prohibited_unless: 'O campo :field é proibido a menos que :other seja :value.',
  exclude_if: 'O campo :field deve ser excluído quando :other é :value.',
  bail: 'Pare a validação após o primeiro erro.',
  missing: 'O campo :field deve estar ausente.',
  missing_if: 'O campo :field deve estar ausente quando :other é :value.',
  missing_unless: 'O campo :field deve estar ausente a menos que :other seja :value.',
  missing_with: 'O campo :field deve estar ausente quando :values está presente.',
  missing_with_all: 'O campo :field deve estar ausente quando :values estão presentes.',
  distinct: 'O campo :field tem valores duplicados.',
  list: 'O campo :field deve ser uma lista.',
  required_array_keys: 'O campo :field deve conter as chaves: :values.',
  in_array: 'O campo :field não existe em :other.',
  in_array_keys: 'O campo :field deve conter apenas chaves de :other.',
  filled: 'O campo :field deve ter um valor.',
  present: 'O campo :field deve estar presente.',
  present_if: 'O campo :field deve estar presente quando :other é :value.',
  present_unless: 'O campo :field deve estar presente a menos que :other seja :value.',
};

// ============================================
// Traduções en
// ============================================

export const en: ValidationMessages = {
  required: 'The :field field is required.',
  not_nullable: 'The :field field cannot be null.',
  invalid_type: 'The :field field must be of type :type.',
  email: 'The :field field must be a valid email address.',
  uuid: 'The :field field must be a valid UUID.',
  url: 'The :field field must be a valid URL.',
  min_length: 'The :field field must be at least :min characters.',
  max_length: 'The :field field must be at most :max characters.',
  min_value: 'The :field field must be at least :min.',
  max_value: 'The :field field must be at most :max.',
  positive: 'The :field field must be positive.',
  negative: 'The :field field must be negative.',
  integer: 'The :field field must be an integer.',
  multiple_of: 'The :field field must be a multiple of :value.',
  range: 'The :field field must be between :min and :max.',
  equal: 'The :field field must be equal to :value.',
  finite: 'The :field field must be a finite number.',
  safe_integer: 'The :field field must be a safe integer.',
  alpha: 'The :field field may only contain letters.',
  alpha_empty: 'The :field field may only contain letters.',
  alpha_num: 'The :field field may only contain letters and numbers.',
  alpha_num_empty: 'The :field field may only contain letters and numbers.',
  alpha_dash: 'The :field field may only contain letters, numbers, dashes, and underscores.',
  alpha_dash_empty: 'The :field field may only contain letters, numbers, dashes, and underscores.',
  active_url: 'The :field field must be an active URL.',
  digits: 'The :field field must be exactly :length digits.',
  digits_between: 'The :field field must be between :min and :max digits.',
  ip: 'The :field field must be a valid IP address.',
  in: 'The selected :field is invalid.',
  not_in: 'The selected :field is forbidden.',
  regex: 'The :field field format is invalid.',
  starts_with: 'The :field field must start with :value.',
  ends_with: 'The :field field must end with :value.',
  contains: 'The :field field must contain :value.',
  empty: 'The :field field must be empty.',
  non_empty: 'The :field field cannot be empty.',
  array: 'The :field field must be an array.',
  boolean: 'The :field field must be a boolean.',
  number: 'The :field field must be a number.',
  string: 'The :field field must be a string.',
  confirmed: 'The :field confirmation does not match.',
  same: 'The :field field must match :other.',
  different: 'The :field field must be different from :other.',
  before: 'The :field field must be a date before :date.',
  after: 'The :field field must be a date after :date.',
  before_or_equal: 'The :field field must be a date before or equal to :date.',
  after_or_equal: 'The :field field must be a date after or equal to :date.',
  date_equals: 'The :field field must be equal to :date.',
  date_format: 'The :field field must be in the format :format.',
  timezone: 'The :field field must be a valid timezone.',
  exists: 'The selected :field does not exist.',
  unique: 'The :field field has already been taken.',
  image: 'The :field field must be an image.',
  dimensions: 'The :field field has invalid dimensions.',
  mimes: 'The :field field must be a file of type: :values.',
  mimetypes: 'The :field field must be a file of type: :values.',
  password: 'The provided password is incorrect.',
  required_if: 'The :field field is required when :other is :value.',
  required_unless: 'The :field field is required unless :other is :value.',
  required_with: 'The :field field is required when :values is present.',
  required_without: 'The :field field is required when :values is not present.',
  prohibited_if: 'The :field field is prohibited when :other is :value.',
  prohibited_unless: 'The :field field is prohibited unless :other is :value.',
  exclude_if: 'The :field field should be excluded when :other is :value.',
  bail: 'Stop validation after the first error.',
  missing: 'The :field field must be missing.',
  missing_if: 'The :field field must be missing when :other is :value.',
  missing_unless: 'The :field field must be missing unless :other is :value.',
  missing_with: 'The :field field must be missing when :values is present.',
  missing_with_all: 'The :field field must be missing when :values are present.',
  distinct: 'The :field field has duplicate values.',
  list: 'The :field field must be a list.',
  required_array_keys: 'The :field field must contain keys: :values.',
  in_array: 'The :field field does not exist in :other.',
  in_array_keys: 'The :field field must contain only keys from :other.',
  filled: 'The :field field must have a value.',
  present: 'The :field field must be present.',
  present_if: 'The :field field must be present when :other is :value.',
  present_unless: 'The :field field must be present unless :other is :value.',
};

// ============================================
// Traduções es
// ============================================

export const es: ValidationMessages = {
  required: 'El campo :field es obligatorio.',
  not_nullable: 'El campo :field no puede ser nulo.',
  invalid_type: 'El campo :field debe ser de tipo :type.',
  email: 'El campo :field debe ser una dirección de email válida.',
  uuid: 'El campo :field debe ser un UUID válido.',
  url: 'El campo :field debe ser una URL válida.',
  min_length: 'El campo :field debe tener al menos :min caracteres.',
  max_length: 'El campo :field debe tener como máximo :max caracteres.',
  min_value: 'El campo :field debe ser al menos :min.',
  max_value: 'El campo :field debe ser como máximo :max.',
  positive: 'El campo :field debe ser positivo.',
  negative: 'El campo :field debe ser negativo.',
  integer: 'El campo :field debe ser un número entero.',
  multiple_of: 'El campo :field debe ser múltiplo de :value.',
  range: 'El campo :field debe estar entre :min y :max.',
  equal: 'El campo :field debe ser igual a :value.',
  finite: 'El campo :field debe ser un número finito.',
  safe_integer: 'El campo :field debe ser un safe integer.',
  alpha: 'El campo :field solo puede contener letras.',
  alpha_empty: 'El campo :field solo puede contener letras.',
  alpha_num: 'El campo :field solo puede contener letras y números.',
  alpha_num_empty: 'El campo :field solo puede contener letras y números.',
  alpha_dash: 'El campo :field solo puede contener letras, números, guiones y guiones bajos.',
  alpha_dash_empty: 'El campo :field solo puede contener letras, números, guiones y guiones bajos.',
  active_url: 'El campo :field debe ser una URL activa.',
  digits: 'El campo :field debe tener exactamente :length dígitos.',
  digits_between: 'El campo :field debe tener entre :min y :max dígitos.',
  ip: 'El campo :field debe ser una dirección IP válida.',
  in: 'El :field seleccionado no es válido.',
  not_in: 'El :field seleccionado está prohibido.',
  regex: 'El formato del campo :field no es válido.',
  starts_with: 'El campo :field debe comenzar con :value.',
  ends_with: 'El campo :field debe terminar con :value.',
  contains: 'El campo :field debe contener :value.',
  empty: 'El campo :field debe estar vacío.',
  non_empty: 'El campo :field no puede estar vacío.',
  array: 'El campo :field debe ser un array.',
  boolean: 'El campo :field debe ser un booleano.',
  number: 'El campo :field debe ser un número.',
  string: 'El campo :field debe ser una cadena de texto.',
  confirmed: 'La confirmación del campo :field no coincide.',
  same: 'El campo :field debe coincidir con :other.',
  different: 'El campo :field debe ser diferente de :other.',
  before: 'El campo :field debe ser una fecha anterior a :date.',
  after: 'El campo :field debe ser una fecha posterior a :date.',
  before_or_equal: 'El campo :field debe ser una fecha anterior o igual a :date.',
  after_or_equal: 'El campo :field debe ser una fecha posterior o igual a :date.',
  date_equals: 'El campo :field debe ser igual a :date.',
  date_format: 'El campo :field debe estar en el formato :format.',
  timezone: 'El campo :field debe ser una zona horaria válida.',
  exists: 'El :field seleccionado no existe.',
  unique: 'El campo :field ya ha sido tomado.',
  image: 'El campo :field debe ser una imagen.',
  dimensions: 'El campo :field tiene dimensiones inválidas.',
  mimes: 'El campo :field debe ser un archivo de tipo: :values.',
  mimetypes: 'El campo :field debe ser un archivo de tipo: :values.',
  password: 'La contraseña proporcionada es incorrecta.',
  required_if: 'El campo :field es obligatorio cuando :other es :value.',
  required_unless: 'El campo :field es obligatorio a menos que :other sea :value.',
  required_with: 'El campo :field es obligatorio cuando :values está presente.',
  required_without: 'El campo :field es obligatorio cuando :values no está presente.',
  prohibited_if: 'El campo :field está prohibido cuando :other es :value.',
  prohibited_unless: 'El campo :field está prohibido a menos que :other sea :value.',
  exclude_if: 'El campo :field debe ser excluido cuando :other es :value.',
  bail: 'Detener la validación después del primer error.',
  missing: 'El campo :field debe estar ausente.',
  missing_if: 'El campo :field debe estar ausente cuando :other es :value.',
  missing_unless: 'El campo :field debe estar ausente a menos que :other sea :value.',
  missing_with: 'El campo :field debe estar ausente cuando :values está presente.',
  missing_with_all: 'El campo :field debe estar ausente cuando :values están presentes.',
  distinct: 'El campo :field tiene valores duplicados.',
  list: 'El campo :field debe ser una lista.',
  required_array_keys: 'El campo :field debe contener las claves: :values.',
  in_array: 'El campo :field no existe en :other.',
  in_array_keys: 'El campo :field debe contener solo claves de :other.',
  filled: 'El campo :field debe tener un valor.',
  present: 'El campo :field debe estar presente.',
  present_if: 'El campo :field debe estar presente cuando :other es :value.',
  present_unless: 'El campo :field debe estar presente a menos que :other sea :value.',
};

// ============================================
// Locale Registry
// ============================================

/**
 * Registro de todas as traduções disponíveis.
 */
export const locales: LocaleTranslations = {
  'pt-BR': ptBR,
  'en': en,
  'es': es,
};

/**
 * Locale padrão.
 */
export const defaultLocale: Locale = 'pt-BR';
