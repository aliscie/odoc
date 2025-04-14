// use lettre::{
//     message::MessageBuilder,
//     transport::smtp::{
//         authentication::Credentials,
//         client::{Tls, TlsParameters},
//         SmtpTransport,
//     },
//     Transport,
// };
// use std::error::Error;

// pub fn send_email(to: &str, title: &str, html_content: &str) -> Result<(), Box<dyn Error>> {
//     let email = MessageBuilder::new()
//         .from("no-reply@odoc.example".parse()?)
//         .to(to.parse()?)
//         .subject(title)
//         .header(lettre::message::header::ContentType::TEXT_HTML)
//         .body(html_content.to_string())?;

//     let creds = Credentials::new(
//         "your_smtp_username".to_string(),
//         "your_smtp_password".to_string(),
//     );

//     let tls = TlsParameters::new("smtp.example.com".to_string())?;

//     let mailer = SmtpTransport::relay("smtp.example.com")?
//         .credentials(creds)
//         .tls(Tls::Required(tls))
//         .build();

//     mailer.send(&email)?;

//     Ok(())
// }