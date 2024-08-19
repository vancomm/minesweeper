export type Success<Output> = {
    success: true
    data: Output
    error?: never
}

export type Failure<Error> = {
    success: false
    error: Error
    data?: never
}

export type Option<Output, Error> = Success<Output> | Failure<Error>

export type DivProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>

export type ParagraphProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
>

export type HeadingProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
>

export type UlProps = React.HTMLAttributes<HTMLUListElement>

export type FormProps = React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
>
