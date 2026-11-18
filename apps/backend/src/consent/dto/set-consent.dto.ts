import { IsBoolean } from 'class-validator';

export class SetConsentDto {
  @IsBoolean({ message: 'Informe se o consentimento foi concedido.' })
  granted: boolean;
}
