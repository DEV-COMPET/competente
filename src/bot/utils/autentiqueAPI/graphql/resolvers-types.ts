import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** CNPJ is represented as a string type in the format 00.000.000/0000-00 */
  CNPJ: any;
  /** CPF is represented as a string type in the format 000.000.000-00 */
  CPF: any;
  /** Date is represented as a string type in the format dd/mm/yyyy */
  Date: any;
  EmailScalar: any;
  JSONScalar: any;
  /** A UNIX timestamp represented as an integer */
  Timestamp: any;
  /** UUID is represented as a string type identifier */
  UUID: any;
  /**
   * The `Upload` special type represents a file to be uploaded in the same HTTP request as specified by
   *  [graphql-multipart-request-spec](https://github.com/jaydenseric/graphql-multipart-request-spec).
   */
  Upload: any;
};

export type AcceptSignatureUnion = HashToSign | Signature;

/** types.Action.description */
export type Action = {
  __typename?: 'Action';
  /** Action name */
  name: ActionEnum;
};

export enum ActionEnum {
  /** enums.Action.acknowledge_receipt */
  AcknowledgeReceipt = 'ACKNOWLEDGE_RECEIPT',
  /** enums.Action.approve */
  Approve = 'APPROVE',
  /** enums.Action.endorse_in_black */
  EndorseInBlack = 'ENDORSE_IN_BLACK',
  /** enums.Action.endorse_in_white */
  EndorseInWhite = 'ENDORSE_IN_WHITE',
  /** enums.Action.recognize */
  Recognize = 'RECOGNIZE',
  /** enums.Action.sign */
  Sign = 'SIGN',
  /** enums.Action.sign_as_a_witness */
  SignAsAWitness = 'SIGN_AS_A_WITNESS',
  /**
   * enums.Action.sign_as_intervener
   * @deprecated Sign as intervener has been deprecated.
   */
  SignAsIntervener = 'SIGN_AS_INTERVENER',
  /**
   * enums.Action.sign_as_part
   * @deprecated Sign as part has been deprecated.
   */
  SignAsPart = 'SIGN_AS_PART'
}

/** types.Affiliate.description */
export type Affiliate = {
  __typename?: 'Affiliate';
  /** types.Affiliate.fields.created_at */
  created_at?: Maybe<Scalars['Timestamp']>;
  /** types.Affiliate.fields.email */
  email?: Maybe<Scalars['EmailScalar']>;
  /** types.Affiliate.fields.full_name */
  full_name?: Maybe<Scalars['String']>;
  /** types.Affiliate.fields.id */
  id?: Maybe<Scalars['String']>;
  /** types.Affiliate.fields.is_receiving_payments */
  is_receiving_payments?: Maybe<Scalars['Boolean']>;
  /** types.Affiliate.fields.payment_info */
  payment_info?: Maybe<Scalars['String']>;
  /** types.Affiliate.fields.referral_code */
  referral_code?: Maybe<Scalars['String']>;
  /** types.Affiliate.fields.referral_configuration */
  referral_configuration?: Maybe<Scalars['String']>;
  /** types.Affiliate.fields.referred_to */
  referred_to?: Maybe<Scalars['String']>;
};

/** inputs.ApiOptions.description */
export type ApiOptionsInput = {
  /** mutations.ApiOptions.args.webhook_url */
  webhook_url?: InputMaybe<Scalars['String']>;
};

/** types.Attribute.description */
export type Attribute = {
  __typename?: 'Attribute';
  /** inputs.Attribute.fields.id */
  id: Scalars['UUID'];
  /** inputs.Attribute.fields.name */
  name: Scalars['String'];
  /** inputs.Attribute.fields.position */
  position?: Maybe<Scalars['String']>;
  /** inputs.Attribute.fields.required */
  required?: Maybe<Scalars['Boolean']>;
  /** inputs.Attribute.fields.type */
  type?: Maybe<Scalars['String']>;
};

/** inputs.Attribute.description */
export type AttributeInput = {
  /** inputs.Attribute.fields.id */
  id?: InputMaybe<Scalars['UUID']>;
  /** inputs.Attribute.fields.name */
  name: Scalars['String'];
  /** inputs.Attribute.fields.position */
  position: Scalars['Int'];
  /** inputs.Attribute.fields.required */
  required: Scalars['Boolean'];
  /** inputs.Attribute.fields.type */
  type: Scalars['String'];
};

export type AuthType = {
  __typename?: 'AuthType';
  access_token: Scalars['String'];
  expires_in: Scalars['Int'];
  token_type: Scalars['String'];
};

/** types.Author.description */
export type Author = {
  __typename?: 'Author';
  /** types.User.fields.company */
  company?: Maybe<Scalars['String']>;
  /** User email */
  email?: Maybe<Scalars['EmailScalar']>;
  /** types.Author.fields.id */
  id: Scalars['UUID'];
  /** Full User name */
  name?: Maybe<Scalars['String']>;
  /** types.Author.fields.organization_id */
  organization_id?: Maybe<Scalars['Int']>;
};

export type Contact = {
  __typename?: 'Contact';
  /** types.Contact.fields.email */
  email?: Maybe<Scalars['EmailScalar']>;
  /** types.Contact.fields.name */
  name?: Maybe<Scalars['String']>;
};

/** enums.Context.description */
export enum ContextEnum {
  /** enums.Context.group */
  Group = 'GROUP',
  /** enums.Context.organization */
  Organization = 'ORGANIZATION',
  /** enums.Context.user */
  User = 'USER'
}

export type CreditPackType = {
  __typename?: 'CreditPackType';
  amount?: Maybe<Scalars['Int']>;
  best?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
};

export type CreditType = {
  __typename?: 'CreditType';
  cost?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
};

/** types.DataSource.description */
export type DataSource = {
  __typename?: 'DataSource';
  /** types.DataSource.fields.birthday */
  birthday?: Maybe<Scalars['Date']>;
  /** types.DataSource.fields.name */
  name?: Maybe<Scalars['String']>;
  /** types.DataSource.fields.voucher */
  voucher?: Maybe<Scalars['String']>;
};

/** enums.DataSource.description */
export enum DataSourceEnum {
  /** enums.DataSource.cnpj */
  Cnpj = 'CNPJ',
  /** enums.DataSource.cpf */
  Cpf = 'CPF'
}

export enum DeliveryMethodEnum {
  DeliveryMethodEmail = 'DELIVERY_METHOD_EMAIL',
  DeliveryMethodLink = 'DELIVERY_METHOD_LINK',
  DeliveryMethodSms = 'DELIVERY_METHOD_SMS',
  DeliveryMethodWhatsapp = 'DELIVERY_METHOD_WHATSAPP'
}

export type Document = {
  __typename?: 'Document';
  author: Author;
  cc?: Maybe<Array<Maybe<Scalars['EmailScalar']>>>;
  configs?: Maybe<DocumentConfig>;
  created_at: Scalars['Timestamp'];
  deadline_at?: Maybe<Scalars['Timestamp']>;
  deleted_at?: Maybe<Scalars['Timestamp']>;
  expiration_at?: Maybe<Scalars['Timestamp']>;
  files: File;
  footer?: Maybe<FooterEnum>;
  hashes: Hash;
  id: Scalars['UUID'];
  ignore_cpf?: Maybe<Scalars['Boolean']>;
  is_blocked?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  new_signature_style?: Maybe<Scalars['Boolean']>;
  notify_in?: Maybe<Scalars['Int']>;
  processed_at?: Maybe<Scalars['Timestamp']>;
  qualified?: Maybe<Scalars['Boolean']>;
  refusable?: Maybe<Scalars['Boolean']>;
  rejected_count?: Maybe<Scalars['Int']>;
  reminder?: Maybe<ReminderEnum>;
  sandbox?: Maybe<Scalars['Boolean']>;
  show_audit_page?: Maybe<Scalars['Boolean']>;
  signatures?: Maybe<Array<Maybe<Signature>>>;
  signatures_count?: Maybe<Scalars['Int']>;
  signed_count?: Maybe<Scalars['Int']>;
  signers_history?: Maybe<Array<Maybe<SignerHistory>>>;
  sortable?: Maybe<Scalars['Boolean']>;
  stop_on_rejected?: Maybe<Scalars['Boolean']>;
  updated_at: Scalars['Timestamp'];
};

export type DocumentConfig = {
  __typename?: 'DocumentConfig';
  notification_finished?: Maybe<Scalars['Boolean']>;
  notification_signed?: Maybe<Scalars['Boolean']>;
  signature_appearance?: Maybe<SignatureAppearanceEnum>;
};

export type DocumentConfigInput = {
  notification_finished?: InputMaybe<Scalars['Boolean']>;
  notification_signed?: InputMaybe<Scalars['Boolean']>;
  signature_appearance?: InputMaybe<SignatureAppearanceEnum>;
};

export type DocumentInput = {
  cc?: InputMaybe<Array<InputMaybe<EmailInput>>>;
  configs?: InputMaybe<DocumentConfigInput>;
  /** Your datetime should be in ISO-8601 format */
  deadline_at?: InputMaybe<Scalars['String']>;
  expiration?: InputMaybe<ExpirationInput>;
  footer?: InputMaybe<FooterEnum>;
  ignore_cpf?: InputMaybe<Scalars['Boolean']>;
  message?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  new_signature_style?: InputMaybe<Scalars['Boolean']>;
  qualified?: InputMaybe<Scalars['Boolean']>;
  refusable?: InputMaybe<Scalars['Boolean']>;
  reminder?: InputMaybe<ReminderEnum>;
  show_audit_page?: InputMaybe<Scalars['Boolean']>;
  sortable?: InputMaybe<Scalars['Boolean']>;
  stop_on_rejected?: InputMaybe<Scalars['Boolean']>;
};

export type DocumentPagination = {
  __typename?: 'DocumentPagination';
  /** Current page of the cursor */
  current_page: Scalars['Int'];
  /** List of Documents on the current page */
  data?: Maybe<Array<Maybe<Document>>>;
  /** Number of the first Documents returned */
  from?: Maybe<Scalars['Int']>;
  /** Last page of Documents */
  last_page?: Maybe<Scalars['Int']>;
  /** Number of Documents returned per page */
  per_page: Scalars['Int'];
  /** Number of the last Document returned */
  to?: Maybe<Scalars['Int']>;
  /** Number of total Documents selected by the query */
  total?: Maybe<Scalars['Int']>;
};

export enum DocumentReportColumnEnum {
  Author = 'AUTHOR',
  CreatedAt = 'CREATED_AT',
  ExpirationAt = 'EXPIRATION_AT',
  Link = 'LINK',
  Name = 'NAME',
  Sha = 'SHA',
  Signatures = 'SIGNATURES',
  Status = 'STATUS'
}

/** types.DocumentSignature.description */
export type DocumentSignature = {
  __typename?: 'DocumentSignature';
  action?: Maybe<Action>;
  /** types.DocumentSignature.fields.document_id */
  document_id: Scalars['UUID'];
  /** types.DocumentSignature.fields.signature_id */
  signature_id: Scalars['UUID'];
  /** types.DocumentSignature.fields.signature_public_id */
  signature_public_id: Scalars['UUID'];
};

/** enums.Status.description */
export enum DocumentStatusEnum {
  /** enums.Status.deleted */
  Deleted = 'DELETED',
  /** enums.Status.not_signed */
  NotSigned = 'NOT_SIGNED',
  /** enums.Status.pending */
  Pending = 'PENDING',
  /** enums.Status.signed */
  Signed = 'SIGNED'
}

/** types.EmailEvent.description */
export type EmailEvent = {
  __typename?: 'EmailEvent';
  /** types.EmailEvent.fields.author */
  author?: Maybe<User>;
  /** types.EmailEvent.fields.delivered */
  delivered?: Maybe<Scalars['String']>;
  /** types.EmailEvent.fields.id */
  id?: Maybe<Scalars['String']>;
  /** types.EmailEvent.fields.opened */
  opened?: Maybe<Scalars['String']>;
  /** types.EmailEvent.fields.reason */
  reason?: Maybe<Scalars['String']>;
  /** types.EmailEvent.fields.refused */
  refused?: Maybe<Scalars['String']>;
  /** types.EmailEvent.fields.sent */
  sent?: Maybe<Scalars['String']>;
  /** types.EmailEvent.fields.type */
  type?: Maybe<EmailTypeEnum>;
  /** types.EmailEvent.fields.user */
  user?: Maybe<User>;
};

/** inputs.Email.description */
export type EmailInput = {
  /** inputs.Email.fields.name */
  email: Scalars['String'];
};

/** types.EmailTemplate.description */
export type EmailTemplate = {
  __typename?: 'EmailTemplate';
  /** types.EmailTemplate.fields.colors */
  colors?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** types.EmailTemplate.fields.image */
  image?: Maybe<Scalars['String']>;
  /** types.EmailTemplate.fields.sender */
  sender?: Maybe<Scalars['String']>;
  /** types.EmailTemplate.fields.subject */
  subject?: Maybe<Scalars['String']>;
  /** types.EmailTemplate.fields.template */
  template?: Maybe<Scalars['String']>;
  /** types.EmailTemplate.fields.text */
  text?: Maybe<Scalars['String']>;
  /** types.EmailTemplate.fields.title */
  title?: Maybe<Scalars['String']>;
  /** types.EmailTemplate.fields.type */
  type?: Maybe<EmailTemplateTypeEnum>;
};

/** enums.EmailTemplateType.description */
export enum EmailTemplateTypeEnum {
  Completed = 'COMPLETED',
  Solicitation = 'SOLICITATION'
}

/** types.EmailTemplates.description */
export type EmailTemplates = {
  __typename?: 'EmailTemplates';
  /** types.EmailTemplates.fields.email */
  email?: Maybe<EmailTemplate>;
  /** types.EmailTemplates.fields.id */
  id: Scalars['Int'];
  /** types.EmailTemplates.fields.name */
  name?: Maybe<Scalars['String']>;
};

/** inputs.EmailTemplates.description */
export type EmailTemplatesInput = {
  /** inputs.EmailTemplates.fields.colors */
  colors?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** inputs.EmailTemplates.fields.image */
  image?: InputMaybe<Scalars['Upload']>;
  /** inputs.EmailTemplates.fields.name */
  name?: InputMaybe<Scalars['String']>;
  /** inputs.EmailTemplates.fields.sender */
  sender?: InputMaybe<Scalars['String']>;
  /** inputs.EmailTemplates.fields.subject */
  subject?: InputMaybe<Scalars['String']>;
  /** inputs.EmailTemplates.fields.template */
  template?: InputMaybe<Scalars['String']>;
  /** inputs.EmailTemplates.fields.text */
  text?: InputMaybe<Scalars['String']>;
  /** inputs.EmailTemplates.fields.title */
  title?: InputMaybe<Scalars['String']>;
  /** inputs.EmailTemplates.fields.type */
  type?: InputMaybe<EmailTemplateTypeEnum>;
};

export type EmailType = {
  __typename?: 'EmailType';
  created_at?: Maybe<Scalars['Timestamp']>;
  deleted_at?: Maybe<Scalars['Timestamp']>;
  email?: Maybe<Scalars['String']>;
  email_verified_at?: Maybe<Scalars['Timestamp']>;
  has_password?: Maybe<Scalars['Boolean']>;
};

/** enums.EmailType.description */
export enum EmailTypeEnum {
  /** enums.EmailType.reminder */
  Reminder = 'REMINDER',
  /** enums.EmailType.resend */
  Resend = 'RESEND',
  /** enums.EmailType.solicitation */
  Solicitation = 'SOLICITATION'
}

/** types.Escavador.description */
export type Escavador = {
  __typename?: 'Escavador';
  /** types.Escavador.fields.body */
  body?: Maybe<Scalars['String']>;
};

/** types.Event.description */
export type Event = {
  __typename?: 'Event';
  created_at?: Maybe<Scalars['Timestamp']>;
  geolocation?: Maybe<Geolocation>;
  ip?: Maybe<Scalars['String']>;
  /** @deprecated Use ip intead. */
  ipv4?: Maybe<Scalars['String']>;
  /** @deprecated Use ip intead. */
  ipv6?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Int']>;
  reason?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  /** Autentique's Privacy */
  user_agent?: Maybe<Scalars['String']>;
};

/** inputs.Expiration.description */
export type ExpirationInput = {
  /** inputs.Expiration.fields.days_before */
  days_before: Scalars['Int'];
  /** inputs.Expiration.fields.notify_at */
  notify_at: Scalars['Date'];
};

export type File = {
  __typename?: 'File';
  certified?: Maybe<Scalars['String']>;
  original?: Maybe<Scalars['String']>;
  pades?: Maybe<Scalars['String']>;
  signed?: Maybe<Scalars['String']>;
};

/** types.Folder.description */
export type Folder = {
  __typename?: 'Folder';
  /** types.Folder.fields.context */
  context: ContextEnum;
  /** Folder created at */
  created_at: Scalars['Timestamp'];
  /** Folder identifier */
  id: Scalars['UUID'];
  /** Full Folder name */
  name: Scalars['String'];
  slug: Scalars['String'];
  /**
   * types.Folder.fields.type
   * @deprecated Deprecated due to use of context field.
   */
  type: FolderTypeEnum;
  /** types.Folder.fields.updated_at */
  updated_at: Scalars['Timestamp'];
};

/** inputs.Folder.description */
export type FolderInput = {
  /** inputs.Folder.fields.name */
  name: Scalars['String'];
};

export type FolderPagination = {
  __typename?: 'FolderPagination';
  /** Current page of the cursor */
  current_page: Scalars['Int'];
  /** List of Folders on the current page */
  data?: Maybe<Array<Maybe<Folder>>>;
  /** Number of the first Folders returned */
  from?: Maybe<Scalars['Int']>;
  /** Last page of Folders */
  last_page?: Maybe<Scalars['Int']>;
  /** Number of Folders returned per page */
  per_page: Scalars['Int'];
  /** Number of the last Folder returned */
  to?: Maybe<Scalars['Int']>;
  /** Number of total Folders selected by the query */
  total?: Maybe<Scalars['Int']>;
};

/** enums.FolderType.description */
export enum FolderTypeEnum {
  /** enums.FolderType.default */
  Default = 'DEFAULT',
  /** enums.FolderType.group */
  Group = 'GROUP',
  /** enums.FolderType.organization */
  Organization = 'ORGANIZATION'
}

/** enums.Font.description */
export enum FontEnum {
  /** enums.Font.autograf */
  Autograf = 'AUTOGRAF',
  /** enums.Font.fathur */
  Fathur = 'FATHUR',
  /** enums.Font.robertson */
  Robertson = 'ROBERTSON'
}

/** enums.Footer.description */
export enum FooterEnum {
  /** enums.Footer.B */
  Bottom = 'BOTTOM',
  /** enums.Footer.L */
  Left = 'LEFT',
  /** enums.Footer.R */
  Right = 'RIGHT'
}

/** types.Geolocation.description */
export type Geolocation = {
  __typename?: 'Geolocation';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  countryISO?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  stateISO?: Maybe<Scalars['String']>;
  zipcode?: Maybe<Scalars['String']>;
};

export type Group = {
  __typename?: 'Group';
  cnpj?: Maybe<Scalars['CNPJ']>;
  company?: Maybe<Scalars['String']>;
  email_template?: Maybe<EmailTemplates>;
  id: Scalars['Int'];
  is_default?: Maybe<Scalars['Boolean']>;
  /** Autentique's Privacy */
  members?: Maybe<Array<Maybe<Member>>>;
  members_count?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  overwrite_template?: Maybe<Scalars['Boolean']>;
  overwrite_template_group?: Maybe<Scalars['Boolean']>;
  permissions?: Maybe<Permission>;
  styles?: Maybe<GroupStyle>;
  uuid?: Maybe<Scalars['String']>;
};

/** inputs.Group.description */
export type GroupInput = {
  /** inputs.Group.fields.name */
  name?: InputMaybe<Scalars['String']>;
  /** inputs.Group.fields.overwrite_template */
  overwrite_template?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Group.fields.overwrite_template_group */
  overwrite_template_group?: InputMaybe<Scalars['Boolean']>;
};

/** types.GroupStyle.description */
export type GroupStyle = {
  __typename?: 'GroupStyle';
  /** types.GroupStyle.fields.overwrite_email */
  overwrite_email?: Maybe<Scalars['Boolean']>;
  /** types.GroupStyle.fields.overwrite_name */
  overwrite_name?: Maybe<Scalars['Boolean']>;
};

/** inputs.GroupStyle.description */
export type GroupStyleInput = {
  /** inputs.GroupStyle.fields.cnpj */
  cnpj?: InputMaybe<Scalars['String']>;
  /** inputs.GroupStyle.fields.company */
  company?: InputMaybe<Scalars['String']>;
  /** inputs.GroupStyle.fields.email_template_id */
  email_template_id?: InputMaybe<Scalars['Int']>;
  /** inputs.GroupStyle.fields.overwrite_email */
  overwrite_email?: InputMaybe<Scalars['Boolean']>;
  /** inputs.GroupStyle.fields.overwrite_name */
  overwrite_name?: InputMaybe<Scalars['Boolean']>;
};

/** types.Hash.description */
export type Hash = {
  __typename?: 'Hash';
  /** types.Hash.fields.md5 */
  md5?: Maybe<Scalars['String']>;
  /** types.Hash.fields.sha1 */
  sha1?: Maybe<Scalars['String']>;
  /** types.Hash.fields.sha256 */
  sha2?: Maybe<Scalars['String']>;
};

export type HashToSign = {
  __typename?: 'HashToSign';
  hash: Scalars['String'];
};

export type Invitation = {
  __typename?: 'Invitation';
  group?: Maybe<Group>;
  id?: Maybe<Scalars['Int']>;
  permissions?: Maybe<Permission>;
  user?: Maybe<User>;
};

export type Invoice = {
  __typename?: 'Invoice';
  description?: Maybe<Scalars['String']>;
  due_date?: Maybe<Scalars['Timestamp']>;
  id?: Maybe<Scalars['Int']>;
  payment_method?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  url_nfse?: Maybe<Scalars['String']>;
  url_payment?: Maybe<Scalars['String']>;
};

export type IuguAddressInput = {
  complement?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
  zip_code?: InputMaybe<Scalars['String']>;
};

export type IuguCard = {
  __typename?: 'IuguCard';
  customer_id?: Maybe<Scalars['String']>;
  data?: Maybe<IuguCardData>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  item_type?: Maybe<Scalars['String']>;
};

export type IuguCardData = {
  __typename?: 'IuguCardData';
  bin?: Maybe<Scalars['String']>;
  brand?: Maybe<Scalars['String']>;
  display_number?: Maybe<Scalars['String']>;
  first_digits?: Maybe<Scalars['String']>;
  holder_name?: Maybe<Scalars['String']>;
  last_digits?: Maybe<Scalars['String']>;
  masked_number?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

/** inputs.IuguCard.description */
export type IuguCardInput = {
  /** mutations.IuguCard.args.description */
  description: Scalars['String'];
  /** mutations.IuguCard.args.set_as_default */
  set_as_default: Scalars['Boolean'];
  /** mutations.IuguCard.args.token */
  token: Scalars['String'];
};

export type IuguCharge = {
  __typename?: 'IuguCharge';
  bank_slip?: Maybe<IuguChargeBankSlip>;
  credit_card?: Maybe<IuguChargeCreditCard>;
  errors?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  method?: Maybe<Scalars['String']>;
  pdf?: Maybe<Scalars['String']>;
  pix?: Maybe<IuguChargePix>;
  url?: Maybe<Scalars['String']>;
};

export type IuguChargeBankSlip = {
  __typename?: 'IuguChargeBankSlip';
  bank_slip_bank?: Maybe<Scalars['Int']>;
  bank_slip_error_code?: Maybe<Scalars['String']>;
  bank_slip_error_message?: Maybe<Scalars['String']>;
  barcode?: Maybe<Scalars['String']>;
  barcode_data?: Maybe<Scalars['String']>;
  digitable_line?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type IuguChargeCreditCard = {
  __typename?: 'IuguChargeCreditCard';
  bin?: Maybe<Scalars['String']>;
  brand?: Maybe<Scalars['String']>;
  info_message?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type IuguChargePix = {
  __typename?: 'IuguChargePix';
  payer_cpf_cnpj?: Maybe<Scalars['Int']>;
  payer_name?: Maybe<Scalars['String']>;
  qrcode?: Maybe<Scalars['String']>;
  qrcode_text?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type IuguCustomer = {
  __typename?: 'IuguCustomer';
  cc_emails?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  complement?: Maybe<Scalars['String']>;
  cpf_cnpj?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Timestamp']>;
  default_payment?: Maybe<IuguCard>;
  district?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  phone_prefix?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Timestamp']>;
  zip_code?: Maybe<Scalars['String']>;
};

export type IuguCustomerInput = {
  cnpj?: InputMaybe<Scalars['String']>;
  cpf?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['EmailScalar']>;
  name?: InputMaybe<Scalars['String']>;
};

/** types.IuguInvoice.description */
export type IuguInvoice = {
  __typename?: 'IuguInvoice';
  /** types.IuguInvoice.fields.created_at */
  created_at?: Maybe<Scalars['Timestamp']>;
  /** types.IuguInvoice.fields.due_date */
  due_date?: Maybe<Scalars['String']>;
  /** types.IuguInvoice.fields.id */
  id?: Maybe<Scalars['String']>;
  /** types.IuguInvoice.fields.paid_at */
  paid_at?: Maybe<Scalars['Timestamp']>;
  /** types.IuguInvoice.fields.payable_with */
  payable_with?: Maybe<IuguPaymentEnum>;
  /** types.IuguInvoice.fields.secure_url */
  secure_url?: Maybe<Scalars['String']>;
  /** types.IuguInvoice.fields.status */
  status?: Maybe<Scalars['String']>;
  /** types.IuguInvoice.fields.total */
  total?: Maybe<Scalars['String']>;
  /** types.IuguInvoice.fields.total_cents */
  total_cents?: Maybe<Scalars['Int']>;
  /** types.IuguInvoice.fields.total_paid */
  total_paid?: Maybe<Scalars['String']>;
  /** types.IuguInvoice.fields.total_paid_cents */
  total_paid_cents?: Maybe<Scalars['Int']>;
  /** types.IuguInvoice.fields.updated_at */
  updated_at?: Maybe<Scalars['Timestamp']>;
};

export type IuguOrder = {
  __typename?: 'IuguOrder';
  active?: Maybe<Scalars['Boolean']>;
  cycled_at?: Maybe<Scalars['Timestamp']>;
  expires_at?: Maybe<Scalars['Timestamp']>;
  payable_with?: Maybe<IuguPaymentEnum>;
  plan_name?: Maybe<Scalars['String']>;
  price_cents?: Maybe<Scalars['Int']>;
  recent_invoices?: Maybe<Scalars['JSONScalar']>;
  suspended?: Maybe<Scalars['Boolean']>;
};

/** inputs.IuguOrder.description */
export type IuguOrderInput = {
  /** inputs.IuguOrder.fields.payable */
  payable: IuguPaymentEnum;
  /** inputs.IuguOrder.fields.plan */
  plan: Scalars['String'];
};

/** enums.IuguPayment.description */
export enum IuguPaymentEnum {
  /** enums.IuguPayment.all */
  All = 'ALL',
  /** enums.IuguPayment.bank_slip */
  BankSlip = 'BANK_SLIP',
  /** enums.IuguPayment.credit_card */
  CreditCard = 'CREDIT_CARD',
  /** enums.IuguPayment.pix */
  Pix = 'PIX'
}

/** types.IuguPlan.description */
export type IuguPlan = {
  __typename?: 'IuguPlan';
  /** types.IuguPlan.fields.documents */
  documents?: Maybe<Scalars['Int']>;
  /** types.IuguPlan.fields.hidden */
  hidden?: Maybe<Scalars['Boolean']>;
  /** types.IuguPlan.fields.id */
  id: Scalars['String'];
  /** types.IuguPlan.fields.identifier */
  identifier?: Maybe<Scalars['String']>;
  /** types.IuguPlan.fields.interval */
  interval?: Maybe<Scalars['String']>;
  /** types.IuguPlan.fields.name */
  name?: Maybe<Scalars['String']>;
  /** types.IuguPlan.fields.price */
  price?: Maybe<Scalars['String']>;
};

/** types.Link.description */
export type Link = {
  __typename?: 'Link';
  /** types.Link.fields.id */
  id: Scalars['String'];
  /** types.Link.fields.short_link */
  short_link?: Maybe<Scalars['String']>;
};

export type Member = {
  __typename?: 'Member';
  created_at?: Maybe<Scalars['Timestamp']>;
  deleted_at?: Maybe<Scalars['Timestamp']>;
  /** @deprecated Deprecated in this version. */
  email?: Maybe<Scalars['EmailScalar']>;
  group?: Maybe<Group>;
  /** @deprecated Deprecated in this version. */
  id: Scalars['String'];
  /** @deprecated Deprecated in this version. */
  name?: Maybe<Scalars['String']>;
  /** Autentique's Privacy */
  organization?: Maybe<Organization>;
  permissions?: Maybe<Permission>;
  /** @deprecated Deprecated in this version. */
  role?: Maybe<Role>;
  user?: Maybe<User>;
};

/** inputs.Member.description */
export type MemberInput = {
  /** inputs.Member.args.email */
  email?: InputMaybe<Scalars['EmailScalar']>;
  /** inputs.Member.args.group_id */
  group_id?: InputMaybe<Scalars['Int']>;
  /** inputs.Member.args.permissions */
  permissions?: InputMaybe<PermissionInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** mutations.CreateDocument.description */
  createDocument?: Maybe<Document>;
  /** mutations.CreateFolder.description */
  createFolder?: Maybe<Folder>;
  /** mutations.CreateSignature.description */
  createSigner?: Maybe<Signature>;
  deleteDocument?: Maybe<Scalars['Boolean']>;
  /** mutations.DeleteFolder.description */
  deleteFolder?: Maybe<Scalars['Boolean']>;
  /** mutations.MoveDocumentToFolder.description */
  moveDocumentToFolder?: Maybe<Scalars['Boolean']>;
  /** mutations.MoveDocumentToRoot.description */
  moveDocumentToRoot?: Maybe<Scalars['Boolean']>;
  signDocument?: Maybe<Scalars['Boolean']>;
  /** mutations.UpdateDocument.description */
  updateDocument?: Maybe<Document>;
  /** mutations.UpdateFolder.description */
  updateFolder?: Maybe<Folder>;
};


export type MutationCreateDocumentArgs = {
  document: DocumentInput;
  file: Scalars['Upload'];
  sandbox?: InputMaybe<Scalars['Boolean']>;
  signers: Array<SignerInput>;
};


export type MutationCreateFolderArgs = {
  folder: FolderInput;
  type?: InputMaybe<FolderTypeEnum>;
};


export type MutationCreateSignerArgs = {
  document_id: Scalars['UUID'];
  signer: SignerInput;
};


export type MutationDeleteDocumentArgs = {
  context?: InputMaybe<ContextEnum>;
  group_uuid?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  member_id?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteFolderArgs = {
  id: Scalars['UUID'];
};


export type MutationMoveDocumentToFolderArgs = {
  context?: InputMaybe<ContextEnum>;
  current_folder_id?: InputMaybe<Scalars['UUID']>;
  document_id: Scalars['UUID'];
  folder_id: Scalars['UUID'];
};


export type MutationMoveDocumentToRootArgs = {
  document_id: Scalars['UUID'];
  folder_id: Scalars['UUID'];
};


export type MutationSignDocumentArgs = {
  id: Scalars['UUID'];
};


export type MutationUpdateDocumentArgs = {
  document: UpdateDocumentInput;
  id: Scalars['UUID'];
};


export type MutationUpdateFolderArgs = {
  folder: FolderInput;
  id: Scalars['UUID'];
};

/** types.Notification.description */
export type Notification = {
  __typename?: 'Notification';
  /** types.Notification.fields.signature_others */
  signature_others: Scalars['Boolean'];
  /** types.Notification.fields.signature_you */
  signature_you: Scalars['Boolean'];
};

/** inputs.Notification.description */
export type NotificationInput = {
  /** mutations.Notification.args.signature_others */
  signature_others: Scalars['Boolean'];
  /** mutations.Notification.args.signature_you */
  signature_you: Scalars['Boolean'];
};

/** inputs.OrderBy.description */
export type OrderBy = {
  /** inputs.OrderBy.fields.direction */
  direction: OrderByEnum;
  /** inputs.OrderBy.fields.field */
  field: Scalars['String'];
};

/** enums.OrderBy.description */
export enum OrderByEnum {
  /** enums.OrderBy.asc */
  Asc = 'ASC',
  /** enums.OrderBy.desc */
  Desc = 'DESC'
}

export type Organization = {
  __typename?: 'Organization';
  cnpj?: Maybe<Scalars['CNPJ']>;
  created_at?: Maybe<Scalars['Timestamp']>;
  customer_id?: Maybe<Scalars['String']>;
  /** Autentique's Privacy */
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['Int'];
  /**
   * Autentique's Privacy
   * @deprecated Deprecated in this version.
   */
  members?: Maybe<Array<Maybe<Member>>>;
  name?: Maybe<Scalars['String']>;
  /** @deprecated Deprecated in this version. */
  overwrite_email: Scalars['Boolean'];
  /** @deprecated Deprecated in this version. */
  overwrite_name: Scalars['Boolean'];
  /** @deprecated Deprecated in this version. */
  overwrite_template: Scalars['Boolean'];
  settings?: Maybe<Setting>;
  /** Autentique's Privacy */
  subscription?: Maybe<Subscription>;
  uuid?: Maybe<Scalars['String']>;
};

/** inputs.Organization.description */
export type OrganizationInput = {
  /** inputs.Organization.fields.cnpj */
  cnpj?: InputMaybe<Scalars['String']>;
  /** inputs.Organization.fields.name */
  name?: InputMaybe<Scalars['String']>;
};

export enum PadesActionEnum {
  Complete = 'COMPLETE',
  Start = 'START'
}

/** inputs.Password.description */
export type PasswordInput = {
  /** inputs.Password.args.current */
  current?: InputMaybe<Scalars['String']>;
  /** inputs.Password.args.new */
  new?: InputMaybe<Scalars['String']>;
  /** inputs.Password.args.new_confirmation */
  new_confirmation?: InputMaybe<Scalars['String']>;
};

/** types.Permission.description */
export type Permission = {
  __typename?: 'Permission';
  /** types.Permission.fields.actions_documents_gr */
  actions_documents_gr?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.actions_documents_oz */
  actions_documents_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.actions_folders_gr */
  actions_folders_gr?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.actions_folders_oz */
  actions_folders_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.actions_groups_oz */
  actions_groups_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.actions_members_oz */
  actions_members_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.actions_templates_gr */
  actions_templates_gr?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.actions_webhooks_oz */
  actions_webhooks_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.archive_documents */
  archive_documents?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.change_appearances_oz */
  change_appearances_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.change_plan_oz */
  change_plan_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.create_documents */
  create_documents?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.delete_documents */
  delete_documents?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.overwrite_permissions */
  overwrite_permissions?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.sign_documents */
  sign_documents?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_documents_gr */
  view_documents_gr?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_documents_oz */
  view_documents_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_folders_gr */
  view_folders_gr?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_folders_oz */
  view_folders_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_group_documents_oz */
  view_group_documents_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_group_folders_oz */
  view_group_folders_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_invoices_oz */
  view_invoices_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_member_documents_oz */
  view_member_documents_oz?: Maybe<Scalars['Boolean']>;
  /** types.Permission.fields.view_member_folders_oz */
  view_member_folders_oz?: Maybe<Scalars['Boolean']>;
};

/** inputs.Permission.description */
export type PermissionInput = {
  /** inputs.Permission.fields.actions_documents_gr */
  actions_documents_gr?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.actions_documents_oz */
  actions_documents_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.actions_folders_gr */
  actions_folders_gr?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.actions_folders_oz */
  actions_folders_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.actions_groups_oz */
  actions_groups_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.actions_members_oz */
  actions_members_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.actions_templates_gr */
  actions_templates_gr?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.actions_webhooks_oz */
  actions_webhooks_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.archive_documents */
  archive_documents?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.change_appearances_oz */
  change_appearances_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.change_plan_oz */
  change_plan_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.create_documents */
  create_documents?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.delete_documents */
  delete_documents?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.overwrite_permissions */
  overwrite_permissions?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.sign_documents */
  sign_documents?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_documents_gr */
  view_documents_gr?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_documents_oz */
  view_documents_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_folders_gr */
  view_folders_gr?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_folders_oz */
  view_folders_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_group_documents_oz */
  view_group_documents_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_group_folders_oz */
  view_group_folders_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_invoices_oz */
  view_invoices_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_member_documents_oz */
  view_member_documents_oz?: InputMaybe<Scalars['Boolean']>;
  /** inputs.Permission.fields.view_member_folders_oz */
  view_member_folders_oz?: InputMaybe<Scalars['Boolean']>;
};

/** enums.PositionElement.description */
export enum PositionElementEnum {
  /** enums.PositionElement.cpf */
  Cpf = 'CPF',
  /** enums.PositionElement.date */
  Date = 'DATE',
  /** enums.PositionElement.initials */
  Initials = 'INITIALS',
  /** enums.PositionElement.name */
  Name = 'NAME',
  /** enums.PositionElement.signature */
  Signature = 'SIGNATURE'
}

export type PositionInput = {
  angle?: InputMaybe<Scalars['Float']>;
  element?: InputMaybe<PositionElementEnum>;
  x: Scalars['String'];
  y: Scalars['String'];
  z: Scalars['Int'];
};

/** types.Provider.description */
export type Provider = {
  __typename?: 'Provider';
  /** types.Provider.fields.name */
  name: Scalars['String'];
};

export type PublicDocument = {
  __typename?: 'PublicDocument';
  author: Author;
  configs?: Maybe<DocumentConfig>;
  created_at: Scalars['Timestamp'];
  deadline_at?: Maybe<Scalars['Timestamp']>;
  expiration_at?: Maybe<Scalars['Timestamp']>;
  files: File;
  footer?: Maybe<FooterEnum>;
  hashes: Hash;
  id: Scalars['UUID'];
  ignore_cpf?: Maybe<Scalars['Boolean']>;
  is_blocked?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  new_signature_style?: Maybe<Scalars['Boolean']>;
  notify_in?: Maybe<Scalars['Int']>;
  qualified?: Maybe<Scalars['Boolean']>;
  refusable?: Maybe<Scalars['Boolean']>;
  reminder?: Maybe<ReminderEnum>;
  sandbox?: Maybe<Scalars['Boolean']>;
  show_audit_page?: Maybe<Scalars['Boolean']>;
  signatures?: Maybe<Array<Maybe<PublicSignature>>>;
  signers_history?: Maybe<Array<Maybe<SignerHistory>>>;
  sortable?: Maybe<Scalars['Boolean']>;
  stop_on_rejected?: Maybe<Scalars['Boolean']>;
  updated_at: Scalars['Timestamp'];
};

/** types.PublicSignature.description */
export type PublicSignature = {
  __typename?: 'PublicSignature';
  /** types.PublicSignature.fields.action */
  action?: Maybe<Action>;
  /** types.PublicSignature.fields.archived_at */
  archived_at?: Maybe<Scalars['Timestamp']>;
  certificate?: Maybe<SignedCertificate>;
  /** types.PublicSignature.fields.configs */
  configs?: Maybe<SignatureConfig>;
  /** types.PublicSignature.fields.created_at */
  created_at?: Maybe<Scalars['Timestamp']>;
  delivery_method?: Maybe<DeliveryMethodEnum>;
  /** types.PublicSignature.fields.document */
  document: PublicDocument;
  /** types.PublicSignature.fields.email */
  email?: Maybe<Scalars['EmailScalar']>;
  /** types.PublicSignature.fields.email_events */
  email_events?: Maybe<EmailEvent>;
  /** types.PublicSignature.fields.email_history */
  email_history?: Maybe<Array<Maybe<EmailEvent>>>;
  /** types.PublicSignature.fields.name */
  name?: Maybe<Scalars['String']>;
  /** types.PublicSignature.fields.parent */
  parent?: Maybe<Scalars['String']>;
  /** types.PublicSignature.fields.positions */
  positions?: Maybe<Array<Maybe<SignaturePosition>>>;
  /** types.PublicSignature.fields.public_id */
  public_id?: Maybe<Scalars['UUID']>;
  /** types.PublicSignature.fields.rejected */
  rejected?: Maybe<Event>;
  /** types.PublicSignature.fields.signed */
  signed?: Maybe<Event>;
  /** types.PublicSignature.fields.updated_at */
  updated_at?: Maybe<Scalars['Timestamp']>;
  /** types.PublicSignature.fields.user */
  user?: Maybe<PublicUser>;
  verifications?: Maybe<Array<Maybe<SecurityVerificationType>>>;
  /** types.PublicSignature.fields.viewed */
  viewed?: Maybe<Event>;
};

/** types.PublicUser.description */
export type PublicUser = {
  __typename?: 'PublicUser';
  /**
   * types.PublicUser.fields.auth_methods
   * @deprecated Deprecated in this version.
   */
  auth_methods?: Maybe<Array<Maybe<Provider>>>;
  /** types.PublicUser.fields.birthday */
  birthday?: Maybe<Scalars['Date']>;
  /** types.PublicUser.fields.company */
  company?: Maybe<Scalars['String']>;
  /** types.PublicUser.fields.cpf */
  cpf?: Maybe<Scalars['CPF']>;
  /** types.PublicUser.fields.created_at */
  created_at: Scalars['Timestamp'];
  /** types.PublicUser.fields.email */
  email?: Maybe<Scalars['EmailScalar']>;
  /** types.PublicUser.fields.escavador */
  escavador?: Maybe<Scalars['String']>;
  /** @deprecated Deprecated in this version. */
  group?: Maybe<Group>;
  /** types.PublicUser.fields.id */
  id: Scalars['UUID'];
  /** types.PublicUser.fields.member */
  member?: Maybe<Member>;
  /** types.PublicUser.fields.name */
  name?: Maybe<Scalars['String']>;
  /** types.PublicUser.fields.organization */
  organization?: Maybe<Organization>;
  /** types.User.fields.phone */
  phone?: Maybe<Scalars['String']>;
  /** types.PublicUser.fields.settings */
  settings?: Maybe<Setting>;
};

export type Query = {
  __typename?: 'Query';
  /** queries.Document.description */
  document?: Maybe<Document>;
  documents?: Maybe<DocumentPagination>;
  documentsByFolder?: Maybe<DocumentPagination>;
  /** queries.Folder.description */
  folder?: Maybe<Folder>;
  /** queries.Folders.description */
  folders?: Maybe<FolderPagination>;
  /** My Autentique account information */
  me?: Maybe<User>;
  /** queries.Organization.description */
  organization?: Maybe<Organization>;
};


export type QueryDocumentArgs = {
  id: Scalars['UUID'];
};


export type QueryDocumentsArgs = {
  context?: InputMaybe<ContextEnum>;
  end_date?: InputMaybe<Scalars['String']>;
  folder_id?: InputMaybe<Scalars['UUID']>;
  group_uuid?: InputMaybe<Scalars['String']>;
  include_archived?: InputMaybe<Scalars['Boolean']>;
  include_deleted?: InputMaybe<Scalars['Boolean']>;
  limit?: Scalars['Int'];
  member_id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<OrderBy>;
  page?: Scalars['Int'];
  search?: InputMaybe<Scalars['String']>;
  showSandbox?: InputMaybe<Scalars['Boolean']>;
  signer?: InputMaybe<Scalars['String']>;
  start_date?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<DocumentStatusEnum>;
};


export type QueryDocumentsByFolderArgs = {
  context?: InputMaybe<ContextEnum>;
  end_date?: InputMaybe<Scalars['String']>;
  folder_id?: InputMaybe<Scalars['UUID']>;
  group_uuid?: InputMaybe<Scalars['String']>;
  include_archived?: InputMaybe<Scalars['Boolean']>;
  include_deleted?: InputMaybe<Scalars['Boolean']>;
  limit?: Scalars['Int'];
  member_id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<OrderBy>;
  page?: Scalars['Int'];
  search?: InputMaybe<Scalars['String']>;
  showSandbox?: InputMaybe<Scalars['Boolean']>;
  signer?: InputMaybe<Scalars['String']>;
  start_date?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<DocumentStatusEnum>;
};


export type QueryFolderArgs = {
  id: Scalars['UUID'];
};


export type QueryFoldersArgs = {
  limit: Scalars['Int'];
  orderBy?: InputMaybe<OrderBy>;
  page: Scalars['Int'];
  search?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<FolderTypeEnum>;
};

/** types.Referral.description */
export type Referral = {
  __typename?: 'Referral';
  /** types.Referral.fields.affiliates */
  affiliates?: Maybe<Array<Maybe<Affiliate>>>;
  /** types.Referral.fields.created_at */
  created_at?: Maybe<Scalars['Timestamp']>;
  /** types.Referral.fields.email */
  email?: Maybe<Scalars['EmailScalar']>;
  /** types.Referral.fields.full_name */
  full_name?: Maybe<Scalars['String']>;
  /** types.Referral.fields.id */
  id?: Maybe<Scalars['String']>;
  /** types.Referral.fields.is_receiving_payments */
  is_receiving_payments?: Maybe<Scalars['Boolean']>;
  monthly_amount?: Maybe<Scalars['String']>;
  payment_info?: Maybe<Scalars['String']>;
  recent_extracts?: Maybe<Scalars['String']>;
  /** types.Referral.fields.referral_code */
  referral_code?: Maybe<Scalars['String']>;
  referral_configuration?: Maybe<Scalars['String']>;
  /** types.Referral.fields.referral_to */
  referral_to?: Maybe<Scalars['String']>;
  /** types.Referral.fields.total_amount */
  total_amount?: Maybe<Scalars['Float']>;
};

/** enums.Reminder.description */
export enum ReminderEnum {
  /** enums.Reminder.daily */
  Daily = 'DAILY',
  /** enums.Reminder.weekly */
  Weekly = 'WEEKLY'
}

/** types.Role.description */
export type Role = {
  __typename?: 'Role';
  /** Role description */
  description: Scalars['String'];
  /** Role identifier */
  id: Scalars['ID'];
  /** Full Role name */
  name: Scalars['String'];
};

/** enums.Role.description */
export enum RoleEnum {
  /** enums.Role.admin */
  Admin = 'ADMIN',
  /** enums.Role.user */
  User = 'USER'
}

export enum SecurityVerificationEnum {
  Live = 'LIVE',
  Sms = 'SMS',
  Upload = 'UPLOAD'
}

export type SecurityVerificationInput = {
  type?: InputMaybe<SecurityVerificationEnum>;
  verify_phone?: InputMaybe<Scalars['String']>;
};

export type SecurityVerificationType = {
  __typename?: 'SecurityVerificationType';
  failcode?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  reference?: Maybe<Scalars['String']>;
  type?: Maybe<SecurityVerificationEnum>;
  url?: Maybe<Scalars['String']>;
  user?: Maybe<SecurityVerificationUser>;
  verified_at?: Maybe<Scalars['Timestamp']>;
  verify_phone?: Maybe<Scalars['String']>;
};

export type SecurityVerificationUser = {
  __typename?: 'SecurityVerificationUser';
  confidence?: Maybe<Scalars['Int']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type SessionType = {
  __typename?: 'SessionType';
  created_at?: Maybe<Scalars['Timestamp']>;
  ip_address?: Maybe<Scalars['String']>;
  user_agent?: Maybe<Scalars['String']>;
};

/** types.Setting.description */
export type Setting = {
  __typename?: 'Setting';
  /** types.Setting.fields.email */
  email?: Maybe<EmailTemplate>;
  /** types.Setting.fields.font */
  font?: Maybe<Scalars['String']>;
  /** types.Setting.fields.format */
  format?: Maybe<Scalars['String']>;
  /** types.Setting.fields.needs_initials */
  has_initials_appearance?: Maybe<Scalars['Boolean']>;
  /** types.Setting.fields.needs_signature */
  has_signature_appearance?: Maybe<Scalars['Boolean']>;
  /** types.Setting.fields.initials */
  initials?: Maybe<Scalars['String']>;
  /** types.Setting.fields.initials_draw */
  initials_draw?: Maybe<Scalars['String']>;
  /** types.Setting.fields.initials_format */
  initials_format?: Maybe<Scalars['String']>;
  /** types.Setting.fields.name */
  name?: Maybe<Scalars['String']>;
  /** types.Setting.fields.signature */
  signature?: Maybe<Scalars['String']>;
  /** types.Setting.fields.signature_draw */
  signature_draw?: Maybe<Scalars['String']>;
  /** types.Setting.fields.signature_text */
  signature_text?: Maybe<Scalars['String']>;
  /** types.Setting.fields.webhook_url */
  webhook_url?: Maybe<Scalars['String']>;
};

/** types.Signature.description */
export type Signature = {
  __typename?: 'Signature';
  action?: Maybe<Action>;
  /** types.Signature.fields.archived_at */
  archived_at?: Maybe<Scalars['Timestamp']>;
  certificate?: Maybe<SignedCertificate>;
  /** types.Signature.fields.configs */
  configs?: Maybe<SignatureConfig>;
  /** Signature created at */
  created_at?: Maybe<Scalars['Timestamp']>;
  delivery_method?: Maybe<DeliveryMethodEnum>;
  /** types.Signature.fields.email */
  email?: Maybe<Scalars['EmailScalar']>;
  /** types.Signature.fields.email_events */
  email_events?: Maybe<EmailEvent>;
  /** types.Signature.fields.email_history */
  email_history?: Maybe<Array<Maybe<EmailEvent>>>;
  /** Autentique's Privacy */
  folder?: Maybe<Folder>;
  /** types.Signature.fields.group_id */
  group_id?: Maybe<Scalars['Int']>;
  link?: Maybe<Link>;
  /** types.Signature.fields.name */
  name?: Maybe<Scalars['String']>;
  /** Autentique's Privacy */
  organization?: Maybe<Organization>;
  /** types.Signature.fields.organization_id */
  organization_id?: Maybe<Scalars['Int']>;
  /** types.Signature.fields.parent */
  parent?: Maybe<Scalars['String']>;
  /** types.Signature.fields.positions */
  positions?: Maybe<Array<Maybe<SignaturePosition>>>;
  /** types.Signature.fields.public_id */
  public_id?: Maybe<Scalars['UUID']>;
  rejected?: Maybe<Event>;
  signed?: Maybe<Event>;
  /** Signature updated at */
  updated_at?: Maybe<Scalars['Timestamp']>;
  /** types.Signature.fields.user */
  user?: Maybe<User>;
  verifications?: Maybe<Array<Maybe<SecurityVerificationType>>>;
  viewed?: Maybe<Event>;
};

export enum SignatureAppearanceEnum {
  Draw = 'DRAW',
  Eletronic = 'ELETRONIC',
  Handwriting = 'HANDWRITING',
  Image = 'IMAGE'
}

export type SignatureConfig = {
  __typename?: 'SignatureConfig';
  cpf?: Maybe<Scalars['String']>;
  overwrite_date?: Maybe<Scalars['Date']>;
  overwrite_name?: Maybe<Scalars['String']>;
};

export type SignatureConfigInput = {
  overwrite_date?: InputMaybe<Scalars['String']>;
  overwrite_name?: InputMaybe<Scalars['String']>;
};

export type SignatureInput = {
  configs?: InputMaybe<SignatureConfigInput>;
  email?: InputMaybe<Scalars['EmailScalar']>;
  positions?: InputMaybe<Array<InputMaybe<PositionInput>>>;
};

export type SignaturePosition = {
  __typename?: 'SignaturePosition';
  angle?: Maybe<Scalars['Float']>;
  element?: Maybe<PositionElementEnum>;
  x: Scalars['String'];
  y: Scalars['String'];
  z: Scalars['Int'];
};

export enum SignatureTypesEnum {
  A1 = 'A1',
  A3 = 'A3',
  Safeid = 'SAFEID'
}

export type SignedCertificate = {
  __typename?: 'SignedCertificate';
  /** Document number (TAX ID) */
  document?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['EmailScalar']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<SignatureTypesEnum>;
};

export type SignerConfigInput = {
  cpf?: InputMaybe<Scalars['String']>;
};

/** types.SignerHistory.description */
export type SignerHistory = {
  __typename?: 'SignerHistory';
  /** types.SignerHistory.fields.author */
  author?: Maybe<PublicSignature>;
  /** types.SignerHistory.fields.category */
  category?: Maybe<SignerHistoryEnum>;
  /** types.SignerHistory.fields.created_at */
  created_at?: Maybe<Scalars['Timestamp']>;
  /** types.SignerHistory.fields.user */
  user?: Maybe<PublicSignature>;
};

/** enums.SignerHistory.description */
export enum SignerHistoryEnum {
  /** enums.SignerHistory.create */
  Create = 'CREATE',
  /** enums.SignerHistory.delete */
  Delete = 'DELETE',
  /** enums.SignerHistory.generate_link */
  GenerateLink = 'GENERATE_LINK'
}

export type SignerInput = {
  action: ActionEnum;
  configs?: InputMaybe<SignerConfigInput>;
  delivery_method?: InputMaybe<DeliveryMethodEnum>;
  email?: InputMaybe<Scalars['EmailScalar']>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  positions?: InputMaybe<Array<InputMaybe<PositionInput>>>;
  security_verifications?: InputMaybe<Array<InputMaybe<SecurityVerificationInput>>>;
};

export type SocialType = {
  __typename?: 'SocialType';
  created_at?: Maybe<Scalars['Timestamp']>;
  deleted_at?: Maybe<Scalars['Timestamp']>;
  email?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
};

/** types.Statistic.description */
export type Statistic = {
  __typename?: 'Statistic';
  /** types.Statistic.fields.documents */
  documents: Scalars['Int'];
  /** types.Statistic.fields.sent */
  sent: Scalars['Int'];
  /** types.Statistic.fields.signatures */
  signatures: Scalars['Int'];
};

/** types.Storage.description */
export type Storage = {
  __typename?: 'Storage';
  path: Scalars['String'];
  size?: Maybe<Scalars['Int']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  bonus: Scalars['Int'];
  bought_at?: Maybe<Scalars['Timestamp']>;
  created_at: Scalars['Timestamp'];
  credits?: Maybe<Scalars['Int']>;
  documents: Scalars['Int'];
  ends_at?: Maybe<Scalars['Timestamp']>;
  expires_at?: Maybe<Scalars['Timestamp']>;
  has_premium_features: Scalars['Boolean'];
  iugu_id?: Maybe<Scalars['String']>;
  iugu_plan?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** types.Template.description */
export type Template = {
  __typename?: 'Template';
  /** types.Template.fields.attributes */
  attributes?: Maybe<Array<Maybe<Attribute>>>;
  /** Folder created at */
  created_at: Scalars['Timestamp'];
  /** types.Template.fields.id */
  id: Scalars['UUID'];
  /** types.Template.fields.name */
  name: Scalars['String'];
  /** types.Template.fields.text */
  text?: Maybe<Scalars['String']>;
  /** types.Folder.fields.updated_at */
  updated_at: Scalars['Timestamp'];
  /** types.Template.fields.user */
  user: User;
};

/** inputs.Template.description */
export type TemplateInput = {
  /** inputs.Template.fields.id */
  id?: InputMaybe<Scalars['UUID']>;
  /** inputs.Template.fields.name */
  name: Scalars['String'];
  /** inputs.Template.fields.text */
  text: Scalars['String'];
};

/** types.Token.description */
export type Token = {
  __typename?: 'Token';
  /** types.Token.fields.access_token */
  access_token: Scalars['String'];
  /** types.Token.fields.created_at */
  created_at: Scalars['Timestamp'];
  /** types.Token.fields.env */
  env: Scalars['String'];
  /** types.Token.fields.token_type */
  token_type: Scalars['String'];
};

/** inputs.Token.description */
export type TokenInput = {
  /** inputs.Token.fields.name */
  name: Scalars['String'];
};

/** enums.Type.description */
export enum TypeEnum {
  /** enums.Type.LINK */
  Link = 'LINK',
  /** enums.Type.SIGNATURE */
  Signature = 'SIGNATURE'
}

export type UpdateDocumentInput = {
  cc?: InputMaybe<Array<InputMaybe<EmailInput>>>;
  configs?: InputMaybe<DocumentConfigInput>;
  /** Your datetime should be in ISO-8601 format */
  deadline_at?: InputMaybe<Scalars['String']>;
  expiration?: InputMaybe<ExpirationInput>;
  footer?: InputMaybe<FooterEnum>;
  ignore_cpf?: InputMaybe<Scalars['Boolean']>;
  message?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  new_signature_style?: InputMaybe<Scalars['Boolean']>;
  refusable?: InputMaybe<Scalars['Boolean']>;
  reminder?: InputMaybe<ReminderEnum>;
  show_audit_page?: InputMaybe<Scalars['Boolean']>;
  sortable?: InputMaybe<Scalars['Boolean']>;
  stop_on_rejected?: InputMaybe<Scalars['Boolean']>;
};

export type User = {
  __typename?: 'User';
  /** @deprecated Deprecated in this version. */
  auth_methods?: Maybe<Array<Maybe<Provider>>>;
  birthday?: Maybe<Scalars['Date']>;
  cnpj?: Maybe<Scalars['CNPJ']>;
  company?: Maybe<Scalars['String']>;
  cpf?: Maybe<Scalars['CPF']>;
  created_at: Scalars['Timestamp'];
  /** @deprecated Deprecated in this version. */
  customer_id?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['EmailScalar']>;
  email_verified_at?: Maybe<Scalars['Timestamp']>;
  /** Autentique's Privacy */
  emails?: Maybe<Array<Maybe<EmailType>>>;
  escavador?: Maybe<Scalars['String']>;
  founder: Scalars['Boolean'];
  /** @deprecated Deprecated in this version. */
  group?: Maybe<Group>;
  id: Scalars['UUID'];
  member?: Maybe<Member>;
  /** Autentique's Privacy */
  members?: Maybe<Array<Maybe<Member>>>;
  name?: Maybe<Scalars['String']>;
  nolt?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  /** @deprecated Deprecated in this version. */
  permissions?: Maybe<Permission>;
  phone?: Maybe<Scalars['String']>;
  /** Autentique's Privacy */
  sessions?: Maybe<Array<Maybe<SessionType>>>;
  settings?: Maybe<Setting>;
  /** Autentique's Privacy */
  socials?: Maybe<Array<Maybe<SocialType>>>;
  /** @deprecated Deprecated in this version. */
  statistics: Statistic;
  subscription?: Maybe<Subscription>;
  updated_at?: Maybe<Scalars['Timestamp']>;
  user_hash?: Maybe<Scalars['String']>;
};

/** inputs.UserDetail.description */
export type UserDetailInput = {
  /** inputs.UserDetail.fields.email */
  email: Scalars['EmailScalar'];
  /** inputs.UserDetail.fields.password */
  password: Scalars['String'];
};

/** inputs.User.description */
export type UserInput = {
  /** inputs.User.fields.birthday */
  birthday?: InputMaybe<Scalars['String']>;
  /** inputs.User.fields.cpf */
  cpf?: InputMaybe<Scalars['String']>;
  /** inputs.User.fields.email */
  email?: InputMaybe<Scalars['EmailScalar']>;
  /** inputs.User.fields.name */
  name?: InputMaybe<Scalars['String']>;
  /** inputs.User.fields.organization */
  organization?: InputMaybe<OrganizationInput>;
  /** inputs.User.fields.password */
  password?: InputMaybe<Scalars['String']>;
};

/** inputs.UserSignature.description */
export type UserSignatureInput = {
  file_draw?: InputMaybe<Scalars['Upload']>;
  file_image?: InputMaybe<Scalars['Upload']>;
  font?: FontEnum;
  format: Scalars['String'];
  signature_text?: InputMaybe<Scalars['String']>;
};

/** types.Webhook.description */
export type Webhook = {
  __typename?: 'Webhook';
  /** types.Webhook.fields.created_at */
  created_at: Scalars['Timestamp'];
  /** types.Webhook.fields.id */
  id: Scalars['Int'];
  /** types.Webhook.fields.type */
  type: Scalars['String'];
  /** types.Webhook.fields.updated_at */
  updated_at: Scalars['Timestamp'];
  /** types.Webhook.fields.url */
  url: Scalars['String'];
};

/** types.WebhookType.description */
export type WebhookType = {
  __typename?: 'WebhookType';
  /** types.WebhookType.fields.created_at */
  created_at: Scalars['Timestamp'];
  /** types.WebhookType.fields.id */
  id: Scalars['Int'];
  /** types.WebhookType.fields.name */
  name: Scalars['String'];
  /** types.WebhookType.fields.updated_at */
  updated_at: Scalars['Timestamp'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes = ResolversObject<{
  AcceptSignatureUnion: ( HashToSign ) | ( Signature );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AcceptSignatureUnion: ResolverTypeWrapper<ResolversUnionTypes['AcceptSignatureUnion']>;
  Action: ResolverTypeWrapper<Action>;
  ActionEnum: ActionEnum;
  Affiliate: ResolverTypeWrapper<Affiliate>;
  ApiOptionsInput: ApiOptionsInput;
  Attribute: ResolverTypeWrapper<Attribute>;
  AttributeInput: AttributeInput;
  AuthType: ResolverTypeWrapper<AuthType>;
  Author: ResolverTypeWrapper<Author>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CNPJ: ResolverTypeWrapper<Scalars['CNPJ']>;
  CPF: ResolverTypeWrapper<Scalars['CPF']>;
  Contact: ResolverTypeWrapper<Contact>;
  ContextEnum: ContextEnum;
  CreditPackType: ResolverTypeWrapper<CreditPackType>;
  CreditType: ResolverTypeWrapper<CreditType>;
  DataSource: ResolverTypeWrapper<DataSource>;
  DataSourceEnum: DataSourceEnum;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DeliveryMethodEnum: DeliveryMethodEnum;
  Document: ResolverTypeWrapper<Document>;
  DocumentConfig: ResolverTypeWrapper<DocumentConfig>;
  DocumentConfigInput: DocumentConfigInput;
  DocumentInput: DocumentInput;
  DocumentPagination: ResolverTypeWrapper<DocumentPagination>;
  DocumentReportColumnEnum: DocumentReportColumnEnum;
  DocumentSignature: ResolverTypeWrapper<DocumentSignature>;
  DocumentStatusEnum: DocumentStatusEnum;
  EmailEvent: ResolverTypeWrapper<EmailEvent>;
  EmailInput: EmailInput;
  EmailScalar: ResolverTypeWrapper<Scalars['EmailScalar']>;
  EmailTemplate: ResolverTypeWrapper<EmailTemplate>;
  EmailTemplateTypeEnum: EmailTemplateTypeEnum;
  EmailTemplates: ResolverTypeWrapper<EmailTemplates>;
  EmailTemplatesInput: EmailTemplatesInput;
  EmailType: ResolverTypeWrapper<EmailType>;
  EmailTypeEnum: EmailTypeEnum;
  Escavador: ResolverTypeWrapper<Escavador>;
  Event: ResolverTypeWrapper<Event>;
  ExpirationInput: ExpirationInput;
  File: ResolverTypeWrapper<File>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Folder: ResolverTypeWrapper<Folder>;
  FolderInput: FolderInput;
  FolderPagination: ResolverTypeWrapper<FolderPagination>;
  FolderTypeEnum: FolderTypeEnum;
  FontEnum: FontEnum;
  FooterEnum: FooterEnum;
  Geolocation: ResolverTypeWrapper<Geolocation>;
  Group: ResolverTypeWrapper<Group>;
  GroupInput: GroupInput;
  GroupStyle: ResolverTypeWrapper<GroupStyle>;
  GroupStyleInput: GroupStyleInput;
  Hash: ResolverTypeWrapper<Hash>;
  HashToSign: ResolverTypeWrapper<HashToSign>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Invitation: ResolverTypeWrapper<Invitation>;
  Invoice: ResolverTypeWrapper<Invoice>;
  IuguAddressInput: IuguAddressInput;
  IuguCard: ResolverTypeWrapper<IuguCard>;
  IuguCardData: ResolverTypeWrapper<IuguCardData>;
  IuguCardInput: IuguCardInput;
  IuguCharge: ResolverTypeWrapper<IuguCharge>;
  IuguChargeBankSlip: ResolverTypeWrapper<IuguChargeBankSlip>;
  IuguChargeCreditCard: ResolverTypeWrapper<IuguChargeCreditCard>;
  IuguChargePix: ResolverTypeWrapper<IuguChargePix>;
  IuguCustomer: ResolverTypeWrapper<IuguCustomer>;
  IuguCustomerInput: IuguCustomerInput;
  IuguInvoice: ResolverTypeWrapper<IuguInvoice>;
  IuguOrder: ResolverTypeWrapper<IuguOrder>;
  IuguOrderInput: IuguOrderInput;
  IuguPaymentEnum: IuguPaymentEnum;
  IuguPlan: ResolverTypeWrapper<IuguPlan>;
  JSONScalar: ResolverTypeWrapper<Scalars['JSONScalar']>;
  Link: ResolverTypeWrapper<Link>;
  Member: ResolverTypeWrapper<Member>;
  MemberInput: MemberInput;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<Notification>;
  NotificationInput: NotificationInput;
  OrderBy: OrderBy;
  OrderByEnum: OrderByEnum;
  Organization: ResolverTypeWrapper<Organization>;
  OrganizationInput: OrganizationInput;
  PadesActionEnum: PadesActionEnum;
  PasswordInput: PasswordInput;
  Permission: ResolverTypeWrapper<Permission>;
  PermissionInput: PermissionInput;
  PositionElementEnum: PositionElementEnum;
  PositionInput: PositionInput;
  Provider: ResolverTypeWrapper<Provider>;
  PublicDocument: ResolverTypeWrapper<PublicDocument>;
  PublicSignature: ResolverTypeWrapper<PublicSignature>;
  PublicUser: ResolverTypeWrapper<PublicUser>;
  Query: ResolverTypeWrapper<{}>;
  Referral: ResolverTypeWrapper<Referral>;
  ReminderEnum: ReminderEnum;
  Role: ResolverTypeWrapper<Role>;
  RoleEnum: RoleEnum;
  SecurityVerificationEnum: SecurityVerificationEnum;
  SecurityVerificationInput: SecurityVerificationInput;
  SecurityVerificationType: ResolverTypeWrapper<SecurityVerificationType>;
  SecurityVerificationUser: ResolverTypeWrapper<SecurityVerificationUser>;
  SessionType: ResolverTypeWrapper<SessionType>;
  Setting: ResolverTypeWrapper<Setting>;
  Signature: ResolverTypeWrapper<Signature>;
  SignatureAppearanceEnum: SignatureAppearanceEnum;
  SignatureConfig: ResolverTypeWrapper<SignatureConfig>;
  SignatureConfigInput: SignatureConfigInput;
  SignatureInput: SignatureInput;
  SignaturePosition: ResolverTypeWrapper<SignaturePosition>;
  SignatureTypesEnum: SignatureTypesEnum;
  SignedCertificate: ResolverTypeWrapper<SignedCertificate>;
  SignerConfigInput: SignerConfigInput;
  SignerHistory: ResolverTypeWrapper<SignerHistory>;
  SignerHistoryEnum: SignerHistoryEnum;
  SignerInput: SignerInput;
  SocialType: ResolverTypeWrapper<SocialType>;
  Statistic: ResolverTypeWrapper<Statistic>;
  Storage: ResolverTypeWrapper<Storage>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Template: ResolverTypeWrapper<Template>;
  TemplateInput: TemplateInput;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']>;
  Token: ResolverTypeWrapper<Token>;
  TokenInput: TokenInput;
  TypeEnum: TypeEnum;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateDocumentInput: UpdateDocumentInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  UserDetailInput: UserDetailInput;
  UserInput: UserInput;
  UserSignatureInput: UserSignatureInput;
  Webhook: ResolverTypeWrapper<Webhook>;
  WebhookType: ResolverTypeWrapper<WebhookType>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AcceptSignatureUnion: ResolversUnionTypes['AcceptSignatureUnion'];
  Action: Action;
  Affiliate: Affiliate;
  ApiOptionsInput: ApiOptionsInput;
  Attribute: Attribute;
  AttributeInput: AttributeInput;
  AuthType: AuthType;
  Author: Author;
  Boolean: Scalars['Boolean'];
  CNPJ: Scalars['CNPJ'];
  CPF: Scalars['CPF'];
  Contact: Contact;
  CreditPackType: CreditPackType;
  CreditType: CreditType;
  DataSource: DataSource;
  Date: Scalars['Date'];
  Document: Document;
  DocumentConfig: DocumentConfig;
  DocumentConfigInput: DocumentConfigInput;
  DocumentInput: DocumentInput;
  DocumentPagination: DocumentPagination;
  DocumentSignature: DocumentSignature;
  EmailEvent: EmailEvent;
  EmailInput: EmailInput;
  EmailScalar: Scalars['EmailScalar'];
  EmailTemplate: EmailTemplate;
  EmailTemplates: EmailTemplates;
  EmailTemplatesInput: EmailTemplatesInput;
  EmailType: EmailType;
  Escavador: Escavador;
  Event: Event;
  ExpirationInput: ExpirationInput;
  File: File;
  Float: Scalars['Float'];
  Folder: Folder;
  FolderInput: FolderInput;
  FolderPagination: FolderPagination;
  Geolocation: Geolocation;
  Group: Group;
  GroupInput: GroupInput;
  GroupStyle: GroupStyle;
  GroupStyleInput: GroupStyleInput;
  Hash: Hash;
  HashToSign: HashToSign;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Invitation: Invitation;
  Invoice: Invoice;
  IuguAddressInput: IuguAddressInput;
  IuguCard: IuguCard;
  IuguCardData: IuguCardData;
  IuguCardInput: IuguCardInput;
  IuguCharge: IuguCharge;
  IuguChargeBankSlip: IuguChargeBankSlip;
  IuguChargeCreditCard: IuguChargeCreditCard;
  IuguChargePix: IuguChargePix;
  IuguCustomer: IuguCustomer;
  IuguCustomerInput: IuguCustomerInput;
  IuguInvoice: IuguInvoice;
  IuguOrder: IuguOrder;
  IuguOrderInput: IuguOrderInput;
  IuguPlan: IuguPlan;
  JSONScalar: Scalars['JSONScalar'];
  Link: Link;
  Member: Member;
  MemberInput: MemberInput;
  Mutation: {};
  Notification: Notification;
  NotificationInput: NotificationInput;
  OrderBy: OrderBy;
  Organization: Organization;
  OrganizationInput: OrganizationInput;
  PasswordInput: PasswordInput;
  Permission: Permission;
  PermissionInput: PermissionInput;
  PositionInput: PositionInput;
  Provider: Provider;
  PublicDocument: PublicDocument;
  PublicSignature: PublicSignature;
  PublicUser: PublicUser;
  Query: {};
  Referral: Referral;
  Role: Role;
  SecurityVerificationInput: SecurityVerificationInput;
  SecurityVerificationType: SecurityVerificationType;
  SecurityVerificationUser: SecurityVerificationUser;
  SessionType: SessionType;
  Setting: Setting;
  Signature: Signature;
  SignatureConfig: SignatureConfig;
  SignatureConfigInput: SignatureConfigInput;
  SignatureInput: SignatureInput;
  SignaturePosition: SignaturePosition;
  SignedCertificate: SignedCertificate;
  SignerConfigInput: SignerConfigInput;
  SignerHistory: SignerHistory;
  SignerInput: SignerInput;
  SocialType: SocialType;
  Statistic: Statistic;
  Storage: Storage;
  String: Scalars['String'];
  Subscription: {};
  Template: Template;
  TemplateInput: TemplateInput;
  Timestamp: Scalars['Timestamp'];
  Token: Token;
  TokenInput: TokenInput;
  UUID: Scalars['UUID'];
  UpdateDocumentInput: UpdateDocumentInput;
  Upload: Scalars['Upload'];
  User: User;
  UserDetailInput: UserDetailInput;
  UserInput: UserInput;
  UserSignatureInput: UserSignatureInput;
  Webhook: Webhook;
  WebhookType: WebhookType;
}>;

export type AcceptSignatureUnionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AcceptSignatureUnion'] = ResolversParentTypes['AcceptSignatureUnion']> = ResolversObject<{
  __resolveType: TypeResolveFn<'HashToSign' | 'Signature', ParentType, ContextType>;
}>;

export type ActionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Action'] = ResolversParentTypes['Action']> = ResolversObject<{
  name?: Resolver<ResolversTypes['ActionEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AffiliateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Affiliate'] = ResolversParentTypes['Affiliate']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  full_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_receiving_payments?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  payment_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referral_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referral_configuration?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referred_to?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AttributeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Attribute'] = ResolversParentTypes['Attribute']> = ResolversObject<{
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthType'] = ResolversParentTypes['AuthType']> = ResolversObject<{
  access_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expires_in?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token_type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = ResolversObject<{
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface CnpjScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CNPJ'], any> {
  name: 'CNPJ';
}

export interface CpfScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CPF'], any> {
  name: 'CPF';
}

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreditPackTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreditPackType'] = ResolversParentTypes['CreditPackType']> = ResolversObject<{
  amount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  best?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreditTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreditType'] = ResolversParentTypes['CreditType']> = ResolversObject<{
  cost?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DataSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataSource'] = ResolversParentTypes['DataSource']> = ResolversObject<{
  birthday?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voucher?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Document'] = ResolversParentTypes['Document']> = ResolversObject<{
  author?: Resolver<ResolversTypes['Author'], ParentType, ContextType>;
  cc?: Resolver<Maybe<Array<Maybe<ResolversTypes['EmailScalar']>>>, ParentType, ContextType>;
  configs?: Resolver<Maybe<ResolversTypes['DocumentConfig']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  deadline_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  deleted_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  expiration_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  files?: Resolver<ResolversTypes['File'], ParentType, ContextType>;
  footer?: Resolver<Maybe<ResolversTypes['FooterEnum']>, ParentType, ContextType>;
  hashes?: Resolver<ResolversTypes['Hash'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  ignore_cpf?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_blocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  new_signature_style?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  notify_in?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  processed_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  qualified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  refusable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  rejected_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  reminder?: Resolver<Maybe<ResolversTypes['ReminderEnum']>, ParentType, ContextType>;
  sandbox?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  show_audit_page?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  signatures?: Resolver<Maybe<Array<Maybe<ResolversTypes['Signature']>>>, ParentType, ContextType>;
  signatures_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  signed_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  signers_history?: Resolver<Maybe<Array<Maybe<ResolversTypes['SignerHistory']>>>, ParentType, ContextType>;
  sortable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  stop_on_rejected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentConfig'] = ResolversParentTypes['DocumentConfig']> = ResolversObject<{
  notification_finished?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  notification_signed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  signature_appearance?: Resolver<Maybe<ResolversTypes['SignatureAppearanceEnum']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentPagination'] = ResolversParentTypes['DocumentPagination']> = ResolversObject<{
  current_page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['Document']>>>, ParentType, ContextType>;
  from?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  last_page?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  per_page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  to?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DocumentSignatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentSignature'] = ResolversParentTypes['DocumentSignature']> = ResolversObject<{
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>;
  document_id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  signature_id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  signature_public_id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailEvent'] = ResolversParentTypes['EmailEvent']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  delivered?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  opened?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refused?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['EmailTypeEnum']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface EmailScalarScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailScalar'], any> {
  name: 'EmailScalar';
}

export type EmailTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailTemplate'] = ResolversParentTypes['EmailTemplate']> = ResolversObject<{
  colors?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  template?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['EmailTemplateTypeEnum']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailTemplatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailTemplates'] = ResolversParentTypes['EmailTemplates']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['EmailTemplate']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailType'] = ResolversParentTypes['EmailType']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  deleted_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email_verified_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  has_password?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EscavadorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Escavador'] = ResolversParentTypes['Escavador']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  geolocation?: Resolver<Maybe<ResolversTypes['Geolocation']>, ParentType, ContextType>;
  ip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ipv4?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ipv6?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  port?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user_agent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = ResolversObject<{
  certified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  original?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pades?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FolderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Folder'] = ResolversParentTypes['Folder']> = ResolversObject<{
  context?: Resolver<ResolversTypes['ContextEnum'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FolderTypeEnum'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FolderPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['FolderPagination'] = ResolversParentTypes['FolderPagination']> = ResolversObject<{
  current_page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['Folder']>>>, ParentType, ContextType>;
  from?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  last_page?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  per_page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  to?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeolocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Geolocation'] = ResolversParentTypes['Geolocation']> = ResolversObject<{
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  countryISO?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  latitude?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stateISO?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zipcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = ResolversObject<{
  cnpj?: Resolver<Maybe<ResolversTypes['CNPJ']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email_template?: Resolver<Maybe<ResolversTypes['EmailTemplates']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  is_default?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['Member']>>>, ParentType, ContextType>;
  members_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overwrite_template?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  overwrite_template_group?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType>;
  styles?: Resolver<Maybe<ResolversTypes['GroupStyle']>, ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GroupStyleResolvers<ContextType = any, ParentType extends ResolversParentTypes['GroupStyle'] = ResolversParentTypes['GroupStyle']> = ResolversObject<{
  overwrite_email?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  overwrite_name?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HashResolvers<ContextType = any, ParentType extends ResolversParentTypes['Hash'] = ResolversParentTypes['Hash']> = ResolversObject<{
  md5?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sha1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sha2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HashToSignResolvers<ContextType = any, ParentType extends ResolversParentTypes['HashToSign'] = ResolversParentTypes['HashToSign']> = ResolversObject<{
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvitationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invitation'] = ResolversParentTypes['Invitation']> = ResolversObject<{
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invoice'] = ResolversParentTypes['Invoice']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  due_date?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  payment_method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url_nfse?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url_payment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguCard'] = ResolversParentTypes['IuguCard']> = ResolversObject<{
  customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['IuguCardData']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  item_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguCardDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguCardData'] = ResolversParentTypes['IuguCardData']> = ResolversObject<{
  bin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  brand?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  display_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_digits?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  holder_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_digits?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  masked_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  month?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguChargeResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguCharge'] = ResolversParentTypes['IuguCharge']> = ResolversObject<{
  bank_slip?: Resolver<Maybe<ResolversTypes['IuguChargeBankSlip']>, ParentType, ContextType>;
  credit_card?: Resolver<Maybe<ResolversTypes['IuguChargeCreditCard']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pdf?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pix?: Resolver<Maybe<ResolversTypes['IuguChargePix']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguChargeBankSlipResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguChargeBankSlip'] = ResolversParentTypes['IuguChargeBankSlip']> = ResolversObject<{
  bank_slip_bank?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bank_slip_error_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bank_slip_error_message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  barcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  barcode_data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  digitable_line?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguChargeCreditCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguChargeCreditCard'] = ResolversParentTypes['IuguChargeCreditCard']> = ResolversObject<{
  bin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  brand?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  info_message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguChargePixResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguChargePix'] = ResolversParentTypes['IuguChargePix']> = ResolversObject<{
  payer_cpf_cnpj?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  payer_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qrcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qrcode_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguCustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguCustomer'] = ResolversParentTypes['IuguCustomer']> = ResolversObject<{
  cc_emails?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  complement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cpf_cnpj?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  default_payment?: Resolver<Maybe<ResolversTypes['IuguCard']>, ParentType, ContextType>;
  district?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone_prefix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  zip_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguInvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguInvoice'] = ResolversParentTypes['IuguInvoice']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  due_date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paid_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  payable_with?: Resolver<Maybe<ResolversTypes['IuguPaymentEnum']>, ParentType, ContextType>;
  secure_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_cents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_paid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_paid_cents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguOrder'] = ResolversParentTypes['IuguOrder']> = ResolversObject<{
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  cycled_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  expires_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  payable_with?: Resolver<Maybe<ResolversTypes['IuguPaymentEnum']>, ParentType, ContextType>;
  plan_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price_cents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  recent_invoices?: Resolver<Maybe<ResolversTypes['JSONScalar']>, ParentType, ContextType>;
  suspended?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IuguPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['IuguPlan'] = ResolversParentTypes['IuguPlan']> = ResolversObject<{
  documents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  hidden?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  identifier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  interval?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONScalar'], any> {
  name: 'JSONScalar';
}

export type LinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['Link'] = ResolversParentTypes['Link']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  short_link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  deleted_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createDocument?: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<MutationCreateDocumentArgs, 'document' | 'file' | 'sandbox' | 'signers'>>;
  createFolder?: Resolver<Maybe<ResolversTypes['Folder']>, ParentType, ContextType, RequireFields<MutationCreateFolderArgs, 'folder'>>;
  createSigner?: Resolver<Maybe<ResolversTypes['Signature']>, ParentType, ContextType, RequireFields<MutationCreateSignerArgs, 'document_id' | 'signer'>>;
  deleteDocument?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteDocumentArgs, 'context' | 'id' | 'member_id'>>;
  deleteFolder?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteFolderArgs, 'id'>>;
  moveDocumentToFolder?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationMoveDocumentToFolderArgs, 'context' | 'current_folder_id' | 'document_id' | 'folder_id'>>;
  moveDocumentToRoot?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationMoveDocumentToRootArgs, 'document_id' | 'folder_id'>>;
  signDocument?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSignDocumentArgs, 'id'>>;
  updateDocument?: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<MutationUpdateDocumentArgs, 'document' | 'id'>>;
  updateFolder?: Resolver<Maybe<ResolversTypes['Folder']>, ParentType, ContextType, RequireFields<MutationUpdateFolderArgs, 'folder' | 'id'>>;
}>;

export type NotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = ResolversObject<{
  signature_others?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  signature_you?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrganizationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = ResolversObject<{
  cnpj?: Resolver<Maybe<ResolversTypes['CNPJ']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  groups?: Resolver<Maybe<Array<Maybe<ResolversTypes['Group']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['Member']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overwrite_email?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  overwrite_name?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  overwrite_template?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['Setting']>, ParentType, ContextType>;
  subscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PermissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = ResolversObject<{
  actions_documents_gr?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  actions_documents_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  actions_folders_gr?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  actions_folders_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  actions_groups_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  actions_members_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  actions_templates_gr?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  actions_webhooks_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  archive_documents?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  change_appearances_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  change_plan_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  create_documents?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  delete_documents?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  overwrite_permissions?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sign_documents?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_documents_gr?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_documents_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_folders_gr?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_folders_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_group_documents_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_group_folders_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_invoices_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_member_documents_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  view_member_folders_oz?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProviderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Provider'] = ResolversParentTypes['Provider']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PublicDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicDocument'] = ResolversParentTypes['PublicDocument']> = ResolversObject<{
  author?: Resolver<ResolversTypes['Author'], ParentType, ContextType>;
  configs?: Resolver<Maybe<ResolversTypes['DocumentConfig']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  deadline_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  expiration_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  files?: Resolver<ResolversTypes['File'], ParentType, ContextType>;
  footer?: Resolver<Maybe<ResolversTypes['FooterEnum']>, ParentType, ContextType>;
  hashes?: Resolver<ResolversTypes['Hash'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  ignore_cpf?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  is_blocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  new_signature_style?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  notify_in?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  qualified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  refusable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reminder?: Resolver<Maybe<ResolversTypes['ReminderEnum']>, ParentType, ContextType>;
  sandbox?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  show_audit_page?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  signatures?: Resolver<Maybe<Array<Maybe<ResolversTypes['PublicSignature']>>>, ParentType, ContextType>;
  signers_history?: Resolver<Maybe<Array<Maybe<ResolversTypes['SignerHistory']>>>, ParentType, ContextType>;
  sortable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  stop_on_rejected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PublicSignatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicSignature'] = ResolversParentTypes['PublicSignature']> = ResolversObject<{
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>;
  archived_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  certificate?: Resolver<Maybe<ResolversTypes['SignedCertificate']>, ParentType, ContextType>;
  configs?: Resolver<Maybe<ResolversTypes['SignatureConfig']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  delivery_method?: Resolver<Maybe<ResolversTypes['DeliveryMethodEnum']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['PublicDocument'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  email_events?: Resolver<Maybe<ResolversTypes['EmailEvent']>, ParentType, ContextType>;
  email_history?: Resolver<Maybe<Array<Maybe<ResolversTypes['EmailEvent']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  positions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SignaturePosition']>>>, ParentType, ContextType>;
  public_id?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  rejected?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType>;
  signed?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['PublicUser']>, ParentType, ContextType>;
  verifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['SecurityVerificationType']>>>, ParentType, ContextType>;
  viewed?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PublicUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUser'] = ResolversParentTypes['PublicUser']> = ResolversObject<{
  auth_methods?: Resolver<Maybe<Array<Maybe<ResolversTypes['Provider']>>>, ParentType, ContextType>;
  birthday?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cpf?: Resolver<Maybe<ResolversTypes['CPF']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  escavador?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['Setting']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  document?: Resolver<Maybe<ResolversTypes['Document']>, ParentType, ContextType, RequireFields<QueryDocumentArgs, 'id'>>;
  documents?: Resolver<Maybe<ResolversTypes['DocumentPagination']>, ParentType, ContextType, RequireFields<QueryDocumentsArgs, 'limit' | 'page'>>;
  documentsByFolder?: Resolver<Maybe<ResolversTypes['DocumentPagination']>, ParentType, ContextType, RequireFields<QueryDocumentsByFolderArgs, 'limit' | 'page'>>;
  folder?: Resolver<Maybe<ResolversTypes['Folder']>, ParentType, ContextType, RequireFields<QueryFolderArgs, 'id'>>;
  folders?: Resolver<Maybe<ResolversTypes['FolderPagination']>, ParentType, ContextType, RequireFields<QueryFoldersArgs, 'limit' | 'page'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
}>;

export type ReferralResolvers<ContextType = any, ParentType extends ResolversParentTypes['Referral'] = ResolversParentTypes['Referral']> = ResolversObject<{
  affiliates?: Resolver<Maybe<Array<Maybe<ResolversTypes['Affiliate']>>>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  full_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_receiving_payments?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  monthly_amount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payment_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recent_extracts?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referral_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referral_configuration?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referral_to?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total_amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SecurityVerificationTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SecurityVerificationType'] = ResolversParentTypes['SecurityVerificationType']> = ResolversObject<{
  failcode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  reference?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['SecurityVerificationEnum']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['SecurityVerificationUser']>, ParentType, ContextType>;
  verified_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  verify_phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SecurityVerificationUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['SecurityVerificationUser'] = ResolversParentTypes['SecurityVerificationUser']> = ResolversObject<{
  confidence?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SessionTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionType'] = ResolversParentTypes['SessionType']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  ip_address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_agent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SettingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Setting'] = ResolversParentTypes['Setting']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['EmailTemplate']>, ParentType, ContextType>;
  font?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_initials_appearance?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  has_signature_appearance?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  initials?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  initials_draw?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  initials_format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signature?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signature_draw?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signature_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  webhook_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['Signature'] = ResolversParentTypes['Signature']> = ResolversObject<{
  action?: Resolver<Maybe<ResolversTypes['Action']>, ParentType, ContextType>;
  archived_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  certificate?: Resolver<Maybe<ResolversTypes['SignedCertificate']>, ParentType, ContextType>;
  configs?: Resolver<Maybe<ResolversTypes['SignatureConfig']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  delivery_method?: Resolver<Maybe<ResolversTypes['DeliveryMethodEnum']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  email_events?: Resolver<Maybe<ResolversTypes['EmailEvent']>, ParentType, ContextType>;
  email_history?: Resolver<Maybe<Array<Maybe<ResolversTypes['EmailEvent']>>>, ParentType, ContextType>;
  folder?: Resolver<Maybe<ResolversTypes['Folder']>, ParentType, ContextType>;
  group_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['Link']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
  organization_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  positions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SignaturePosition']>>>, ParentType, ContextType>;
  public_id?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  rejected?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType>;
  signed?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  verifications?: Resolver<Maybe<Array<Maybe<ResolversTypes['SecurityVerificationType']>>>, ParentType, ContextType>;
  viewed?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignatureConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignatureConfig'] = ResolversParentTypes['SignatureConfig']> = ResolversObject<{
  cpf?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overwrite_date?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  overwrite_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignaturePositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignaturePosition'] = ResolversParentTypes['SignaturePosition']> = ResolversObject<{
  angle?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  element?: Resolver<Maybe<ResolversTypes['PositionElementEnum']>, ParentType, ContextType>;
  x?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  z?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignedCertificateResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignedCertificate'] = ResolversParentTypes['SignedCertificate']> = ResolversObject<{
  document?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['SignatureTypesEnum']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignerHistoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignerHistory'] = ResolversParentTypes['SignerHistory']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['PublicSignature']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['SignerHistoryEnum']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['PublicSignature']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SocialTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SocialType'] = ResolversParentTypes['SocialType']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  deleted_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  provider?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatisticResolvers<ContextType = any, ParentType extends ResolversParentTypes['Statistic'] = ResolversParentTypes['Statistic']> = ResolversObject<{
  documents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  signatures?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StorageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Storage'] = ResolversParentTypes['Storage']> = ResolversObject<{
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  bonus?: SubscriptionResolver<ResolversTypes['Int'], "bonus", ParentType, ContextType>;
  bought_at?: SubscriptionResolver<Maybe<ResolversTypes['Timestamp']>, "bought_at", ParentType, ContextType>;
  created_at?: SubscriptionResolver<ResolversTypes['Timestamp'], "created_at", ParentType, ContextType>;
  credits?: SubscriptionResolver<Maybe<ResolversTypes['Int']>, "credits", ParentType, ContextType>;
  documents?: SubscriptionResolver<ResolversTypes['Int'], "documents", ParentType, ContextType>;
  ends_at?: SubscriptionResolver<Maybe<ResolversTypes['Timestamp']>, "ends_at", ParentType, ContextType>;
  expires_at?: SubscriptionResolver<Maybe<ResolversTypes['Timestamp']>, "expires_at", ParentType, ContextType>;
  has_premium_features?: SubscriptionResolver<ResolversTypes['Boolean'], "has_premium_features", ParentType, ContextType>;
  iugu_id?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "iugu_id", ParentType, ContextType>;
  iugu_plan?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "iugu_plan", ParentType, ContextType>;
  name?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "name", ParentType, ContextType>;
}>;

export type TemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Template'] = ResolversParentTypes['Template']> = ResolversObject<{
  attributes?: Resolver<Maybe<Array<Maybe<ResolversTypes['Attribute']>>>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  access_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  env?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token_type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  auth_methods?: Resolver<Maybe<Array<Maybe<ResolversTypes['Provider']>>>, ParentType, ContextType>;
  birthday?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  cnpj?: Resolver<Maybe<ResolversTypes['CNPJ']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cpf?: Resolver<Maybe<ResolversTypes['CPF']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  customer_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailScalar']>, ParentType, ContextType>;
  email_verified_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  emails?: Resolver<Maybe<Array<Maybe<ResolversTypes['EmailType']>>>, ParentType, ContextType>;
  escavador?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  founder?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['Member']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nolt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sessions?: Resolver<Maybe<Array<Maybe<ResolversTypes['SessionType']>>>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['Setting']>, ParentType, ContextType>;
  socials?: Resolver<Maybe<Array<Maybe<ResolversTypes['SocialType']>>>, ParentType, ContextType>;
  statistics?: Resolver<ResolversTypes['Statistic'], ParentType, ContextType>;
  subscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  user_hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WebhookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Webhook'] = ResolversParentTypes['Webhook']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WebhookTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebhookType'] = ResolversParentTypes['WebhookType']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AcceptSignatureUnion?: AcceptSignatureUnionResolvers<ContextType>;
  Action?: ActionResolvers<ContextType>;
  Affiliate?: AffiliateResolvers<ContextType>;
  Attribute?: AttributeResolvers<ContextType>;
  AuthType?: AuthTypeResolvers<ContextType>;
  Author?: AuthorResolvers<ContextType>;
  CNPJ?: GraphQLScalarType;
  CPF?: GraphQLScalarType;
  Contact?: ContactResolvers<ContextType>;
  CreditPackType?: CreditPackTypeResolvers<ContextType>;
  CreditType?: CreditTypeResolvers<ContextType>;
  DataSource?: DataSourceResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Document?: DocumentResolvers<ContextType>;
  DocumentConfig?: DocumentConfigResolvers<ContextType>;
  DocumentPagination?: DocumentPaginationResolvers<ContextType>;
  DocumentSignature?: DocumentSignatureResolvers<ContextType>;
  EmailEvent?: EmailEventResolvers<ContextType>;
  EmailScalar?: GraphQLScalarType;
  EmailTemplate?: EmailTemplateResolvers<ContextType>;
  EmailTemplates?: EmailTemplatesResolvers<ContextType>;
  EmailType?: EmailTypeResolvers<ContextType>;
  Escavador?: EscavadorResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  Folder?: FolderResolvers<ContextType>;
  FolderPagination?: FolderPaginationResolvers<ContextType>;
  Geolocation?: GeolocationResolvers<ContextType>;
  Group?: GroupResolvers<ContextType>;
  GroupStyle?: GroupStyleResolvers<ContextType>;
  Hash?: HashResolvers<ContextType>;
  HashToSign?: HashToSignResolvers<ContextType>;
  Invitation?: InvitationResolvers<ContextType>;
  Invoice?: InvoiceResolvers<ContextType>;
  IuguCard?: IuguCardResolvers<ContextType>;
  IuguCardData?: IuguCardDataResolvers<ContextType>;
  IuguCharge?: IuguChargeResolvers<ContextType>;
  IuguChargeBankSlip?: IuguChargeBankSlipResolvers<ContextType>;
  IuguChargeCreditCard?: IuguChargeCreditCardResolvers<ContextType>;
  IuguChargePix?: IuguChargePixResolvers<ContextType>;
  IuguCustomer?: IuguCustomerResolvers<ContextType>;
  IuguInvoice?: IuguInvoiceResolvers<ContextType>;
  IuguOrder?: IuguOrderResolvers<ContextType>;
  IuguPlan?: IuguPlanResolvers<ContextType>;
  JSONScalar?: GraphQLScalarType;
  Link?: LinkResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  Provider?: ProviderResolvers<ContextType>;
  PublicDocument?: PublicDocumentResolvers<ContextType>;
  PublicSignature?: PublicSignatureResolvers<ContextType>;
  PublicUser?: PublicUserResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Referral?: ReferralResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  SecurityVerificationType?: SecurityVerificationTypeResolvers<ContextType>;
  SecurityVerificationUser?: SecurityVerificationUserResolvers<ContextType>;
  SessionType?: SessionTypeResolvers<ContextType>;
  Setting?: SettingResolvers<ContextType>;
  Signature?: SignatureResolvers<ContextType>;
  SignatureConfig?: SignatureConfigResolvers<ContextType>;
  SignaturePosition?: SignaturePositionResolvers<ContextType>;
  SignedCertificate?: SignedCertificateResolvers<ContextType>;
  SignerHistory?: SignerHistoryResolvers<ContextType>;
  SocialType?: SocialTypeResolvers<ContextType>;
  Statistic?: StatisticResolvers<ContextType>;
  Storage?: StorageResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Template?: TemplateResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  Token?: TokenResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Webhook?: WebhookResolvers<ContextType>;
  WebhookType?: WebhookTypeResolvers<ContextType>;
}>;

