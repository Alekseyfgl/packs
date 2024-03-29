import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SendRequestButton } from '../../../../common/components/ButtonSendRequest/SendRequestButton';
import React, { useState } from 'react';
import { ILoginDto } from '../../auth.api.interfaces';
import { authThunks } from '../../auth.slice';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../app/hooks';
import { emailValidate } from 'common/utils/validationFormRules/email.validate';
import { passwordValidate } from 'common/utils/validationFormRules/password.validate';
import { MSG_BTN } from '../../../../common/utils/constans/app-messages.const';

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSentRequest, setIsSentRequest] = useState(false);
    const dispatch = useAppDispatch();
    const loginHandler = (loginDto: ILoginDto) => {
        setIsSentRequest(true);
        dispatch(authThunks.login(loginDto)).finally(() => {
            setIsSentRequest(false);
        });
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ILoginDto>();
    const onSubmit = (data: ILoginDto) => {
        loginHandler(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
                <TextField label="Email" margin="normal" {...register('email', emailValidate)} error={!!errors.email} helperText={errors.email?.message} />
                <FormControl margin="normal">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        {...register('password', passwordValidate)}
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        error={!!errors.password}
                    />
                    {!!errors.password && (
                        <FormHelperText error id="accountId-error">
                            {errors.password?.message}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControlLabel label={'Remember me'} control={<Checkbox {...register('rememberMe')} />} />
                <SendRequestButton isSentRequest={isSentRequest}>{MSG_BTN.SING_IN}</SendRequestButton>
            </FormGroup>
        </form>
    );
};
