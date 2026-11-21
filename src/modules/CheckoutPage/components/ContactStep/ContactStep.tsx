import { StepCard } from '../StepCard';
import { Field, FieldGroup, Suggestion, TextField } from '../Field';
import { PhoneInput } from '../PhoneInput';
import { Form } from '../../hooks/useForm';
import { ContactValues } from '../../types';
import { getEmailSuggestion } from '../../utils/emailSuggestion';

type Props = {
  form: Form<ContactValues>;
  shouldFocus: boolean;
  onNext: () => void;
};

export const ContactStep = ({ form, shouldFocus, onNext }: Props) => {
  const email = form.field('email');
  const phone = form.field('phone');
  const emailSuggestion = form.isTouched('email')
    ? getEmailSuggestion(email.value)
    : null;

  return (
    <StepCard
      title="Contact details"
      subtitle="Used only to show your order details. Nothing is sent anywhere."
      submitLabel="Continue to delivery"
      shouldFocus={shouldFocus}
      onSubmit={() => form.submit(onNext)}
    >
      <FieldGroup>
        <TextField
          {...form.field('firstName')}
          label="First name"
          autoComplete="given-name"
          isCompact
          maxLength={50}
        />
        <TextField
          {...form.field('lastName')}
          label="Last name"
          autoComplete="family-name"
          isCompact
          maxLength={50}
        />
        <TextField
          {...email}
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          maxLength={100}
          isWide
          hint={
            emailSuggestion && (
              <Suggestion
                value={emailSuggestion}
                onApply={() => form.setValue('email', emailSuggestion)}
              />
            )
          }
        />
        <Field id={phone.id} label="Phone" error={phone.error} isWide>
          <PhoneInput {...phone} />
        </Field>
      </FieldGroup>
    </StepCard>
  );
};
