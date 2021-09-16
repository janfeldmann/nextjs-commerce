import commerce from '@lib/api/commerce'
import Cookies from 'js-cookie'
import { Layout } from '@components/common'
import type { GetStaticPropsContext } from 'next'
import { useEffect } from 'react'
import { useCart, useCheckoutComplete } from '@framework/cart'
import Link from '@components/ui/Link'
import { CHECKOUT_ID_COOKIE } from '@framework/const'
import { Container, Button, Text } from '@components/ui'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { categories } = await siteInfoPromise

  return {
    props: {
      categories,
    },
  }
}

export default function Success() {
  const checkoutComplete = useCheckoutComplete()
  const { data } = useCart()

  useEffect(() => {
    const complete = async () => {
      try {
        await checkoutComplete()
      } catch (err) {
        console.log(err)
      }
    }

    // TODO: Check if payment is really valid

    // Clear checkout after order is confirmed
    if (data?.order?.id) {
      Cookies.remove(CHECKOUT_ID_COOKIE)
    }

    if (data?.token) {
      complete()
    } else {
      console.log('NO TOKEN FOUND')
    }
  }, [data])

  return (
    <>
      <Container className="mt-10">
        <Text variant="pageHeading">Bestellbestätiung</Text>

        {data?.order?.id && (
          <div>
            Ihre Bestellnummer lautet:{' '}
            <Text variant="sectionHeading">{data?.order?.id}</Text>
          </div>
        )}
        {!data?.order?.id ? (
          <div>
            Ihre Bestellung konnte leider nicht ausgeführt werden, bitte
            überprüfen Sie Ihre Angaben im{' '}
            <Link href="/cart">
              <span className="underline">Bestellprozess</span>
            </Link>
          </div>
        ) : null}
        <Button href="/" Component="a" className="mt-6">
          Weiter shoppen
        </Button>
      </Container>
    </>
  )
}

Success.Layout = Layout
